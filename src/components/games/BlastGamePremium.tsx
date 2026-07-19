"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useUser } from "@/context/user-context";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import VirtualJoystick from "./VirtualJoystick";

interface BlastGameProps {
  onExit?: () => void;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  options: string[];
  topic: string;
  subject: string;
  source: string;
}

interface GameStats {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  streak: number;
  isPersonalBest: boolean;
}

export default function BlastGamePremium({ onExit }: BlastGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  // Touch controls state
  const [touchAngle, setTouchAngle] = useState<number>(0); // Current cannon angle for touch controls
  const [useJoystick, setUseJoystick] = useState<boolean>(true); // Toggle between buttons and joystick

  // Fetch questions from API
  useEffect(() => {
    async function fetchQuestions() {
      if (!user?.current_exam) {
        setError("Please select an exam first");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/blast/content?examId=${user.current_exam}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load questions");
        }

        const data = await response.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (err: any) {
        console.error("[Blast Game] Error fetching questions:", err);
        setError(err.message || "Failed to load questions. Please try again.");
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [user?.current_exam]);

  // Cleanup touch control global state on unmount
  useEffect(() => {
    return () => {
      (window as any).__BLAST_TOUCH_ANGLE__ = undefined;
    };
  }, []);

  useEffect(() => {
    if (!gameRef.current || loading || error || questions.length === 0) return;

    // Use fetched questions
    const QUESTIONS = questions;

    // Store examId and completion callback globally
    (window as any).__BLAST_EXAM_ID__ = user?.current_exam;
    (window as any).__BLAST_ON_COMPLETE__ = (stats: GameStats) => {
      setGameStats(stats);
      setGameComplete(true);
    };

    class BlastScene extends Phaser.Scene {
      private asteroidObjects: Array<{
        container: Phaser.GameObjects.Container;
        blob: Phaser.GameObjects.Graphics;
        innerShadow: Phaser.GameObjects.Graphics;
        outerGlow: Phaser.GameObjects.Graphics;
        label: Phaser.GameObjects.Text;
        isCorrect: boolean;
        floatTween?: Phaser.Tweens.Tween;
        breatheTween?: Phaser.Tweens.Tween;
      }> = [];
      private currentQuestion = 0;
      private score = 0;
      private level = 1;
      private streak = 0;
      private timeLeft = 60;
      private locked = false;
      private questionText!: Phaser.GameObjects.Text;
      private progressBar!: Phaser.GameObjects.Graphics;
      private scoreText!: Phaser.GameObjects.Text;
      private levelText!: Phaser.GameObjects.Text;
      private timerText!: Phaser.GameObjects.Text;
      private streakText!: Phaser.GameObjects.Text;
      private levelProgressBar!: Phaser.GameObjects.Graphics;
      private xpText!: Phaser.GameObjects.Text;
      private streakProgressBar!: Phaser.GameObjects.Graphics;
      private spaceshipContainer!: Phaser.GameObjects.Container;
      private cannonSprite!: Phaser.GameObjects.Graphics;
      private spaceshipX!: number;
      private spaceshipY!: number;
      private stars: Phaser.GameObjects.Graphics[] = [];
      private planets: Phaser.GameObjects.Graphics[] = [];
      private spaceshipShield!: Phaser.Physics.Arcade.Image;

      constructor() {
        super({ key: "BlastScene" });
      }

      create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.currentQuestion = 0;
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.timeLeft = 60;
        this.locked = false;

        // Physics bounds: exclude header (top 220px) and spaceship area (bottom 150px)
        this.physics.world.setBounds(0, 240, width, height - 390);

        // Premium cosmic background
        this.createCosmicBackground();

        // Create distant planets
        this.createPlanets();

        // Create animated stars
        this.createStarfield();

        // Purple header
        this.createHeader();

        // Premium spaceship
        this.createPremiumSpaceship();

        // Create invisible shield around spaceship (prevents asteroid collisions)
        this.createSpaceshipShield();

        // Bottom HUD
        this.createBottomHUD();

        // Floating timer
        this.timerText = this.add.text(width / 2, 280, "60", {
          fontSize: "96px",
          color: "#ffffff",
          fontFamily: "Arial Black, sans-serif",
          fontStyle: "bold",
        });
        this.timerText.setOrigin(0.5);
        this.timerText.setAlpha(0.25);
        this.timerText.setDepth(5);

        // Load first question
        this.loadQuestion();

        // Start timer
        this.time.addEvent({
          delay: 1000,
          callback: this.updateTimer,
          callbackScope: this,
          loop: true,
        });
      }

      createCosmicBackground() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Deep space gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0820, 0x0a0820, 0x1a0f3e, 0x0f0525, 1);
        bg.fillRect(0, 0, width, height);

        // Nebula clouds (purple)
        const nebula1 = this.add.graphics();
        nebula1.fillStyle(0x5b21b6, 0.15);
        nebula1.fillCircle(width * 0.3, height * 0.3, 400);
        nebula1.setBlendMode(Phaser.BlendModes.ADD);

        const nebula2 = this.add.graphics();
        nebula2.fillStyle(0x7c3aed, 0.1);
        nebula2.fillCircle(width * 0.7, height * 0.6, 500);
        nebula2.setBlendMode(Phaser.BlendModes.ADD);

        // Animate nebula drift
        this.tweens.add({
          targets: nebula1,
          x: "+=20",
          y: "+=10",
          duration: 20000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        this.tweens.add({
          targets: nebula2,
          x: "-=30",
          y: "+=15",
          duration: 25000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }

      createPlanets() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Distant planet 1 (purple)
        const planet1 = this.add.graphics();
        planet1.fillGradientStyle(0x6d28d9, 0x4c1d95, 0x3b0764, 0x2e1065, 1);
        planet1.fillCircle(width * 0.15, height * 0.25, 80);
        planet1.setAlpha(0.4);
        planet1.setBlendMode(Phaser.BlendModes.ADD);
        this.planets.push(planet1);

        // Distant planet 2 (blue)
        const planet2 = this.add.graphics();
        planet2.fillGradientStyle(0x3b82f6, 0x1e40af, 0x1e3a8a, 0x1e3a8a, 1);
        planet2.fillCircle(width * 0.85, height * 0.4, 60);
        planet2.setAlpha(0.3);
        planet2.setBlendMode(Phaser.BlendModes.ADD);
        this.planets.push(planet2);

        // Slow drift
        this.planets.forEach((planet, i) => {
          this.tweens.add({
            targets: planet,
            y: `+=${i % 2 === 0 ? 10 : -10}`,
            duration: 15000 + i * 2000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        });
      }

      createStarfield() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Three layers of stars for parallax
        for (let layer = 0; layer < 3; layer++) {
          const count = layer === 0 ? 150 : layer === 1 ? 80 : 40;
          const alpha = layer === 0 ? 0.8 : layer === 1 ? 0.6 : 0.4;
          const size = layer === 0 ? 1.5 : layer === 1 ? 2 : 3;

          for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;

            const star = this.add.graphics();
            star.fillStyle(0xffffff, alpha);
            star.fillCircle(x, y, size);
            star.setDepth(layer);

            this.stars.push(star);

            // Twinkle animation
            this.tweens.add({
              targets: star,
              alpha: alpha * 0.3,
              duration: 1000 + Math.random() * 2000,
              yoyo: true,
              repeat: -1,
              delay: Math.random() * 1000,
            });
          }
        }
      }

      createHeader() {
        const width = this.scale.width;

        // Purple gradient header
        const header = this.add.graphics();
        header.fillGradientStyle(0x5b21b6, 0x5b21b6, 0x4c1d95, 0x4c1d95, 1);
        header.fillRect(0, 0, width, 200);
        header.setDepth(10);

        // Question text
        this.questionText = this.add.text(width / 2, 100, "", {
          fontSize: "32px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: width - 200 },
        });
        this.questionText.setOrigin(0.5);
        this.questionText.setDepth(11);

        // Progress bar
        this.progressBar = this.add.graphics();
        this.progressBar.setDepth(11);
      }

      createPremiumSpaceship() {
        const width = this.scale.width;
        const height = this.scale.height;
        const shipX = width / 2;
        const shipY = height - 120;

        this.spaceshipX = shipX;
        this.spaceshipY = shipY;

        this.spaceshipContainer = this.add.container(shipX, shipY);
        this.spaceshipContainer.setDepth(50);

        // === ENGINE GLOW (bottom, behind ship) ===
        const engineGlow = this.add.graphics();
        engineGlow.fillStyle(0x22d3ee, 0.4);
        engineGlow.fillCircle(0, 40, 35);
        engineGlow.setBlendMode(Phaser.BlendModes.ADD);

        // === ENGINE FLAMES (animated) ===
        const leftFlame = this.add.graphics();
        leftFlame.fillGradientStyle(0x67e8f9, 0x22d3ee, 0x0891b2, 0x0e7490, 1);
        leftFlame.fillTriangle(-25, 30, -20, 55, -15, 30);

        const rightFlame = this.add.graphics();
        rightFlame.fillGradientStyle(0x67e8f9, 0x22d3ee, 0x0891b2, 0x0e7490, 1);
        rightFlame.fillTriangle(15, 30, 20, 55, 25, 30);

        // === LEFT WING ===
        const leftWing = this.add.graphics();
        leftWing.fillGradientStyle(0x1e3a8a, 0x1e40af, 0x3b82f6, 0x60a5fa, 1);
        leftWing.beginPath();
        leftWing.moveTo(-20, 0);
        leftWing.lineTo(-60, 10);
        leftWing.lineTo(-55, 30);
        leftWing.lineTo(-25, 25);
        leftWing.closePath();
        leftWing.fillPath();
        leftWing.lineStyle(2, 0x1e3a8a, 1);
        leftWing.strokePath();

        // === RIGHT WING ===
        const rightWing = this.add.graphics();
        rightWing.fillGradientStyle(0x1e3a8a, 0x1e40af, 0x3b82f6, 0x60a5fa, 1);
        rightWing.beginPath();
        rightWing.moveTo(20, 0);
        rightWing.lineTo(60, 10);
        rightWing.lineTo(55, 30);
        rightWing.lineTo(25, 25);
        rightWing.closePath();
        rightWing.fillPath();
        rightWing.lineStyle(2, 0x1e3a8a, 1);
        rightWing.strokePath();

        // === MAIN BODY (arrow/triangle shape) ===
        const mainBody = this.add.graphics();
        mainBody.fillGradientStyle(0x3b82f6, 0x2563eb, 0x1d4ed8, 0x1e40af, 1);
        mainBody.beginPath();
        mainBody.moveTo(0, -40);      // Nose (top point)
        mainBody.lineTo(-30, 30);     // Bottom left
        mainBody.lineTo(30, 30);      // Bottom right
        mainBody.closePath();
        mainBody.fillPath();
        mainBody.lineStyle(3, 0x1e3a8a, 1);
        mainBody.strokePath();

        // === COCKPIT WINDOW ===
        const cockpit = this.add.graphics();
        cockpit.fillGradientStyle(0x67e8f9, 0x22d3ee, 0x06b6d4, 0x0891b2, 0.9);
        cockpit.beginPath();
        cockpit.moveTo(0, -25);
        cockpit.lineTo(-15, 0);
        cockpit.lineTo(15, 0);
        cockpit.closePath();
        cockpit.fillPath();

        // === COCKPIT GLOW ===
        const cockpitGlow = this.add.graphics();
        cockpitGlow.fillStyle(0x67e8f9, 0.5);
        cockpitGlow.fillCircle(0, -15, 20);
        cockpitGlow.setBlendMode(Phaser.BlendModes.ADD);

        // === DETAIL LINES (panels) ===
        const details = this.add.graphics();
        details.lineStyle(2, 0x60a5fa, 0.6);
        details.lineTo(-10, -10);
        details.lineTo(-10, 20);
        details.moveTo(10, -10);
        details.lineTo(10, 20);
        details.strokePath();

        // === WING LIGHTS (glowing dots) ===
        const leftLight = this.add.circle(-55, 20, 4, 0x22c55e, 0.9);
        leftLight.setBlendMode(Phaser.BlendModes.ADD);

        const rightLight = this.add.circle(55, 20, 4, 0x22c55e, 0.9);
        rightLight.setBlendMode(Phaser.BlendModes.ADD);

        // === ROTATING CANNON (on top of ship) ===
        this.cannonSprite = this.add.graphics();
        // Cannon base mount
        this.cannonSprite.fillStyle(0x64748b, 1);
        this.cannonSprite.fillCircle(0, -25, 10);
        // Cannon barrel
        this.cannonSprite.fillGradientStyle(0xe2e8f0, 0xcbd5e1, 0x94a3b8, 0x64748b, 1);
        this.cannonSprite.fillRoundedRect(-6, -55, 12, 35, 4);
        this.cannonSprite.lineStyle(2, 0x475569, 1);
        this.cannonSprite.strokeRoundedRect(-6, -55, 12, 35, 4);
        // Cannon tip (cyan glow)
        this.cannonSprite.fillStyle(0x22d3ee, 0.8);
        this.cannonSprite.fillCircle(0, -58, 6);

        // === OUTER SHIELD RING (energy field) ===
        const shieldRing = this.add.graphics();
        shieldRing.lineStyle(2, 0x22d3ee, 0.3);
        shieldRing.strokeCircle(0, 0, 80);

        // Add all parts to container (bottom to top layering)
        this.spaceshipContainer.add([
          engineGlow,
          leftFlame,
          rightFlame,
          leftWing,
          rightWing,
          mainBody,
          cockpitGlow,
          cockpit,
          details,
          leftLight,
          rightLight,
          this.cannonSprite,
          shieldRing,
        ]);

        // === ANIMATIONS ===

        // Engine flames flicker
        this.tweens.add({
          targets: [leftFlame, rightFlame],
          alpha: 0.6,
          scaleY: 0.8,
          duration: 150,
          yoyo: true,
          repeat: -1,
        });

        // Engine glow pulse
        this.tweens.add({
          targets: engineGlow,
          alpha: 0.7,
          scale: 1.2,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        // Wing lights blink
        this.tweens.add({
          targets: [leftLight, rightLight],
          alpha: 0.3,
          duration: 800,
          yoyo: true,
          repeat: -1,
        });

        // Shield ring pulse
        this.tweens.add({
          targets: shieldRing,
          alpha: 0.6,
          scale: 1.1,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        // Cockpit glow breathe
        this.tweens.add({
          targets: cockpitGlow,
          alpha: 0.8,
          scale: 1.15,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }

      createSpaceshipShield() {
        // Create invisible physics barrier around spaceship
        // This prevents asteroids from getting too close
        const shieldGraphics = this.add.graphics();
        shieldGraphics.fillStyle(0xffffff, 0); // Invisible
        shieldGraphics.fillCircle(this.spaceshipX, this.spaceshipY, 120);
        shieldGraphics.generateTexture("spaceship-shield", 240, 240);
        shieldGraphics.destroy();

        this.spaceshipShield = this.physics.add.image(this.spaceshipX, this.spaceshipY, "spaceship-shield");
        this.spaceshipShield.setDepth(1);
        this.spaceshipShield.setAlpha(0); // Invisible
        this.spaceshipShield.setImmovable(true); // Doesn't move when hit
        this.spaceshipShield.body?.setCircle(120);
      }

      createBottomHUD() {
        const width = this.scale.width;
        const height = this.scale.height;
        const bottomY = height - 50;

        // LEFT: Level progress (Quizlet style)
        const xpForNextLevel = 50;
        const currentXP = this.score % xpForNextLevel;
        const currentLevel = Math.floor(this.score / xpForNextLevel) + 1;

        // Level text
        this.levelText = this.add.text(30, bottomY - 25, `Lvl ${currentLevel}`, {
          fontSize: "16px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
        });
        this.levelText.setOrigin(0, 0);
        this.levelText.setDepth(100);

        // XP text (above bar, right-aligned to bar end)
        const levelBarWidth = 160;
        this.xpText = this.add.text(30 + levelBarWidth, bottomY - 25, `${currentXP}/${xpForNextLevel}`, {
          fontSize: "14px",
          color: "#93c5fd",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
        });
        this.xpText.setOrigin(1, 0); // Right-aligned
        this.xpText.setDepth(101);

        // Level progress bar background
        const levelBarHeight = 8;
        const levelBarBg = this.add.graphics();
        levelBarBg.fillStyle(0x1e293b, 1);
        levelBarBg.fillRoundedRect(30, bottomY, levelBarWidth, levelBarHeight, 4);
        levelBarBg.setDepth(99);

        // Level progress bar fill
        this.levelProgressBar = this.add.graphics();
        this.levelProgressBar.setDepth(100);
        // Initial fill (0 progress at start)
        const initialProgress = currentXP / xpForNextLevel;
        this.levelProgressBar.fillStyle(0x3b82f6, 1);
        this.levelProgressBar.fillRoundedRect(30, bottomY, levelBarWidth * initialProgress, levelBarHeight, 4);

        // RIGHT: Streak (Quizlet style)
        // Streak text
        this.streakText = this.add.text(width - 190, bottomY - 15, `Streak x${this.streak}`, {
          fontSize: "16px",
          color: "#c084fc",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
        });
        this.streakText.setOrigin(1, 0);
        this.streakText.setDepth(100);

        // Streak progress bar background
        const streakBarWidth = 160;
        const streakBarHeight = 8;
        const streakBarBg = this.add.graphics();
        streakBarBg.fillStyle(0x1e293b, 1);
        streakBarBg.fillRoundedRect(width - 190, bottomY, streakBarWidth, streakBarHeight, 4);
        streakBarBg.setDepth(99);

        // Streak progress bar fill
        this.streakProgressBar = this.add.graphics();
        this.streakProgressBar.setDepth(100);
        // Initial fill (0 streak at start, so empty bar)

        // Remove old score text (we'll use level XP instead)
        this.scoreText = this.add.text(0, 0, "", { fontSize: "1px" });
        this.scoreText.setVisible(false);
      }

      loadQuestion() {
        const question = QUESTIONS[this.currentQuestion % QUESTIONS.length];
        this.questionText.setText(question.question);

        // Update progress
        const progress = this.currentQuestion / QUESTIONS.length;
        this.progressBar.clear();
        this.progressBar.fillGradientStyle(0x8b5cf6, 0xd946ef, 0x8b5cf6, 0xd946ef, 1);
        this.progressBar.fillRect(0, 195, this.scale.width * progress, 5);

        // Clear existing asteroids
        this.asteroidObjects.forEach(obj => {
          if (obj.floatTween) obj.floatTween.stop();
          if (obj.breatheTween) obj.breatheTween.stop();
          obj.container.destroy();
        });
        this.asteroidObjects = [];

        const width = this.scale.width;
        const height = this.scale.height;

        // Spawn asteroids in safe zone (away from header and spaceship)
        const safeTop = 300;
        const safeBottom = height - 200;
        const positions = [
          { x: width * 0.2, y: safeTop + (safeBottom - safeTop) * 0.2 },
          { x: width * 0.5, y: safeTop + (safeBottom - safeTop) * 0.4 },
          { x: width * 0.75, y: safeTop + (safeBottom - safeTop) * 0.6 },
          { x: width * 0.35, y: safeTop + (safeBottom - safeTop) * 0.8 },
        ];

        question.options.forEach((option, index) => {
          const isCorrect = option === question.answer;
          const pos = positions[index] || { x: width / 2, y: height / 2 };
          this.createOrganicAsteroid(pos.x, pos.y, option, isCorrect, index);
        });
      }

      createOrganicAsteroid(x: number, y: number, text: string, isCorrect: boolean, seed: number) {
        // Create container for all asteroid parts
        const container = this.add.container(x, y);
        container.setDepth(20);

        // Larger asteroids (was 70, now 90)
        const asteroidRadius = 90;
        const points = this.generateOrganicShape(seed, asteroidRadius);

        // Outer glow (blue instead of purple)
        const outerGlow = this.add.graphics();
        this.drawBlobShape(outerGlow, points, 1.12, 0x3b82f6, 0.4);

        // Main blob body (blue gradient)
        const blob = this.add.graphics();
        this.drawBlueBlobGradient(blob, points, 1.0);

        // Inner shadow for depth
        const innerShadow = this.add.graphics();
        this.drawBlobShape(innerShadow, points, 0.9, 0x1e3a8a, 0.25);

        // Dynamic text sizing based on text length
        const textLength = text.length;
        let fontSize = "18px";
        let wrapWidth = 160;

        if (textLength > 100) {
          fontSize = "14px";
          wrapWidth = 160;
        } else if (textLength > 60) {
          fontSize = "15px";
          wrapWidth = 160;
        } else if (textLength > 40) {
          fontSize = "16px";
          wrapWidth = 160;
        }

        const label = this.add.text(0, 0, text, {
          fontSize: fontSize,
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontStyle: "600",
          align: "center",
          wordWrap: { width: wrapWidth },
          resolution: 2,
        });
        label.setOrigin(0.5);

        container.add([outerGlow, blob, innerShadow, label]);

        // Physics (larger size)
        this.physics.add.existing(container as any);
        const body = (container as any).body as Phaser.Physics.Arcade.Body;
        body.setCircle(asteroidRadius);
        body.setVelocity(
          Phaser.Math.Between(-100, 100),
          Phaser.Math.Between(-100, 100)
        );
        body.setBounce(0.9, 0.9);
        body.setCollideWorldBounds(true);

        // Interactive (larger hit area)
        const hitArea = new Phaser.Geom.Circle(0, 0, asteroidRadius);
        container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

        container.on("pointerdown", () => {
          this.handleAsteroidClick(container, isCorrect);
        });

        // Hover effect (spring physics)
        container.on("pointerover", () => {
          this.tweens.add({
            targets: container,
            scale: 1.08,
            duration: 300,
            ease: "Back.easeOut",
          });
        });

        container.on("pointerout", () => {
          this.tweens.add({
            targets: container,
            scale: 1.0,
            duration: 300,
            ease: "Back.easeOut",
          });
        });

        // NO ANIMATIONS - completely static (zero flickering)
        // Asteroids only move via physics velocity
        const floatTween = undefined;
        const breatheTween = undefined;

        this.asteroidObjects.push({
          container,
          blob,
          innerShadow,
          outerGlow,
          label,
          isCorrect,
          floatTween,
          breatheTween,
        });

        // Collisions with other asteroids
        this.asteroidObjects.forEach(other => {
          if (other.container !== container) {
            this.physics.add.collider(container as any, other.container as any);
          }
        });

        // Collision with spaceship shield (prevents asteroids from reaching spaceship)
        this.physics.add.collider(container as any, this.spaceshipShield, () => {
          // Bounce asteroid away when it hits shield
          const body = (container as any).body as Phaser.Physics.Arcade.Body;
          const dx = container.x - this.spaceshipX;
          const dy = container.y - this.spaceshipY;
          const angle = Math.atan2(dy, dx);

          // Push asteroid away from spaceship
          body.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150);
        });
      }

      generateOrganicShape(seed: number, baseRadius: number): Array<{ x: number; y: number }> {
        const points: Array<{ x: number; y: number }> = [];
        const segments = 60; // Smooth wavy circle

        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;

          // Single smooth sine wave for gentle waves (like Quizlet)
          const wave = Math.sin(i * 0.8) * 4; // Small amplitude = gentle waves
          const r = baseRadius + wave;

          points.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r,
          });
        }

        return points;
      }

      drawBlobShape(
        graphics: Phaser.GameObjects.Graphics,
        points: Array<{ x: number; y: number }>,
        scale: number,
        color: number,
        alpha: number
      ) {
        graphics.clear();
        graphics.fillStyle(color, alpha);
        graphics.beginPath();
        graphics.moveTo(points[0].x * scale, points[0].y * scale);
        for (let i = 1; i < points.length; i++) {
          graphics.lineTo(points[i].x * scale, points[i].y * scale);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.setAlpha(alpha); // Set consistent alpha to prevent flickering
      }

      drawBlobGradient(
        graphics: Phaser.GameObjects.Graphics,
        points: Array<{ x: number; y: number }>,
        scale: number
      ) {
        graphics.clear();

        // Purple gradient (claymorphism)
        graphics.fillGradientStyle(0x7c3aed, 0x6d28d9, 0x5b21b6, 0x4c1d95, 1);
        graphics.beginPath();
        graphics.moveTo(points[0].x * scale, points[0].y * scale);
        for (let i = 1; i < points.length; i++) {
          graphics.lineTo(points[i].x * scale, points[i].y * scale);
        }
        graphics.closePath();
        graphics.fillPath();

        // Border
        graphics.lineStyle(3, 0x4c1d95, 0.8);
        graphics.strokePath();
      }

      drawBlueBlobGradient(
        graphics: Phaser.GameObjects.Graphics,
        points: Array<{ x: number; y: number }>,
        scale: number
      ) {
        graphics.clear();

        // Blue gradient (lighter, more vibrant)
        graphics.fillGradientStyle(0x60a5fa, 0x3b82f6, 0x2563eb, 0x1d4ed8, 1);
        graphics.beginPath();
        graphics.moveTo(points[0].x * scale, points[0].y * scale);
        for (let i = 1; i < points.length; i++) {
          graphics.lineTo(points[i].x * scale, points[i].y * scale);
        }
        graphics.closePath();
        graphics.fillPath();

        // Border
        graphics.lineStyle(3, 0x1e40af, 0.8);
        graphics.strokePath();
      }

      handleAsteroidClick(container: Phaser.GameObjects.Container, isCorrect: boolean) {
        if (this.locked) return;
        this.locked = true;

        // Fire laser
        this.firePremiumLaser(container.x, container.y);

        this.time.delayedCall(250, () => {
          if (isCorrect) {
            this.correctAnswerFeedback(container);
          } else {
            this.wrongAnswerFeedback(container);
          }
        });
      }

      firePremiumLaser(targetX: number, targetY: number) {
        const cannonLength = 50;
        const cannonAngle = this.cannonSprite.rotation;

        const cannonTipX = this.spaceshipX + Math.sin(cannonAngle) * cannonLength;
        const cannonTipY = this.spaceshipY - Math.cos(cannonAngle) * cannonLength;

        // Muzzle flash at cannon tip
        const flash = this.add.circle(cannonTipX, cannonTipY, 20, 0x22d3ee, 0.9);
        flash.setDepth(47);
        flash.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
          targets: flash,
          scale: 2,
          alpha: 0,
          duration: 200,
          ease: "Cubic.easeOut",
          onComplete: () => flash.destroy(),
        });

        // Create bullet projectile
        const bullet = this.add.circle(cannonTipX, cannonTipY, 8, 0x22d3ee, 1);
        bullet.setDepth(46);

        // Bullet glow/trail
        const bulletGlow = this.add.circle(cannonTipX, cannonTipY, 16, 0x67e8f9, 0.6);
        bulletGlow.setDepth(45);
        bulletGlow.setBlendMode(Phaser.BlendModes.ADD);

        // Calculate travel distance for speed calculation
        const distance = Phaser.Math.Distance.Between(cannonTipX, cannonTipY, targetX, targetY);
        const duration = Math.max(200, distance * 0.8); // Speed based on distance (faster for far targets)

        // Animate bullet to target
        this.tweens.add({
          targets: bullet,
          x: targetX,
          y: targetY,
          duration: duration,
          ease: "Linear",
          onComplete: () => bullet.destroy(),
        });

        // Animate bullet glow (follows bullet)
        this.tweens.add({
          targets: bulletGlow,
          x: targetX,
          y: targetY,
          duration: duration,
          ease: "Linear",
          onComplete: () => bulletGlow.destroy(),
        });

        // Bullet trail effect (fading particles behind bullet)
        const trailInterval = this.time.addEvent({
          delay: 20,
          repeat: Math.floor(duration / 20),
          callback: () => {
            const trailParticle = this.add.circle(bullet.x, bullet.y, 6, 0x67e8f9, 0.8);
            trailParticle.setDepth(44);
            trailParticle.setBlendMode(Phaser.BlendModes.ADD);

            this.tweens.add({
              targets: trailParticle,
              alpha: 0,
              scale: 0.3,
              duration: 300,
              ease: "Cubic.easeOut",
              onComplete: () => trailParticle.destroy(),
            });
          },
        });
      }

      correctAnswerFeedback(container: Phaser.GameObjects.Container) {
        this.score += 5;
        this.streak = Math.min(10, this.streak + 1);

        // Level calculation: Level 1 = 0-49 XP, Level 2 = 50-99 XP, etc.
        const xpForNextLevel = 50;
        const currentLevel = Math.floor(this.score / xpForNextLevel) + 1;
        const currentXP = this.score % xpForNextLevel;
        const progress = currentXP / xpForNextLevel;

        this.level = currentLevel;
        this.levelText.setText(`Lvl ${currentLevel}`);
        this.xpText.setText(`${currentXP}/${xpForNextLevel}`);

        // Update level progress bar
        this.levelProgressBar.clear();
        this.levelProgressBar.fillStyle(0x3b82f6, 1);
        this.levelProgressBar.fillRoundedRect(30, this.scale.height - 50, 160 * progress, 8, 4);

        // Update streak bar (Quizlet style)
        const streakProgress = Math.min(1, this.streak / 10);
        this.streakText.setText(`Streak x${this.streak}`);

        // Update streak progress bar
        this.streakProgressBar.clear();
        this.streakProgressBar.fillStyle(0xc084fc, 1);
        this.streakProgressBar.fillRoundedRect(this.scale.width - 190, this.scale.height - 100, 160 * streakProgress, 8, 4);

        // Premium explosion
        this.createPremiumExplosion(container.x, container.y);

        // Screen shake
        this.cameras.main.shake(200, 0.005);

        // XP particle to HUD
        this.createXPParticles(container.x, container.y);

        // Destroy asteroid
        this.tweens.add({
          targets: container,
          scale: 0,
          alpha: 0,
          angle: 45,
          duration: 400,
          ease: "Back.easeIn",
          onComplete: () => {
            container.destroy();
            this.asteroidObjects = this.asteroidObjects.filter(obj => obj.container !== container);
          },
        });

        // Next question
        this.time.delayedCall(800, () => {
          this.currentQuestion++;
          this.loadQuestion();
          this.locked = false;
        });
      }

      wrongAnswerFeedback(container: Phaser.GameObjects.Container) {
        this.score = Math.max(0, this.score - 2);
        this.streak = 0;

        // Update level bar
        const xpForNextLevel = 50;
        const currentLevel = Math.floor(this.score / xpForNextLevel) + 1;
        const currentXP = this.score % xpForNextLevel;
        const progress = currentXP / xpForNextLevel;

        this.level = currentLevel;
        this.levelText.setText(`Lvl ${currentLevel}`);
        this.xpText.setText(`${currentXP}/${xpForNextLevel}`);

        // Update level progress bar
        this.levelProgressBar.clear();
        this.levelProgressBar.fillStyle(0x3b82f6, 1);
        this.levelProgressBar.fillRoundedRect(30, this.scale.height - 50, 160 * progress, 8, 4);

        // Reset streak bar
        this.streakText.setText("Streak x0");
        this.streakProgressBar.clear();

        // Shake asteroid
        this.tweens.add({
          targets: container,
          x: container.x + 10,
          duration: 50,
          yoyo: true,
          repeat: 5,
          ease: "Sine.easeInOut",
        });

        // Red pulse
        const redFlash = this.add.circle(container.x, container.y, 80, 0xef4444, 0.5);
        redFlash.setDepth(25);
        redFlash.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
          targets: redFlash,
          scale: 1.5,
          alpha: 0,
          duration: 400,
          onComplete: () => redFlash.destroy(),
        });

        // "-2" score popup in RED
        const scorePopup = this.add.text(container.x, container.y, "-2", {
          fontSize: "56px",
          color: "#ef4444",
          fontFamily: "Arial Black, sans-serif",
          fontStyle: "bold",
        });
        scorePopup.setOrigin(0.5);
        scorePopup.setDepth(52);
        scorePopup.setStroke("#7f1d1d", 4);

        this.tweens.add({
          targets: scorePopup,
          y: container.y - 60,
          alpha: 0,
          scale: 1.3,
          duration: 800,
          ease: "Back.easeOut",
          onComplete: () => scorePopup.destroy(),
        });

        // Small debris
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const debris = this.add.circle(container.x, container.y, 4, 0xef4444);
          debris.setDepth(26);
          this.tweens.add({
            targets: debris,
            x: container.x + Math.cos(angle) * 60,
            y: container.y + Math.sin(angle) * 60,
            alpha: 0,
            duration: 500,
            onComplete: () => debris.destroy(),
          });
        }

        this.time.delayedCall(600, () => {
          this.locked = false;
        });
      }

      createPremiumExplosion(x: number, y: number) {
        // Central glow burst
        const burst = this.add.circle(x, y, 100, 0xfbbf24, 0.8);
        burst.setDepth(50);
        burst.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
          targets: burst,
          scale: 3,
          alpha: 0,
          duration: 600,
          ease: "Cubic.easeOut",
          onComplete: () => burst.destroy(),
        });

        // Particles
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2;
          const distance = 120 + Math.random() * 40;
          const size = 4 + Math.random() * 6;
          const colors = [0xfbbf24, 0xfcd34d, 0xfef3c7, 0xffffff];
          const color = colors[Math.floor(Math.random() * colors.length)];

          const particle = this.add.circle(x, y, size, color);
          particle.setDepth(51);

          this.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            alpha: 0,
            scale: 0.2,
            duration: 800 + Math.random() * 400,
            ease: "Cubic.easeOut",
            onComplete: () => particle.destroy(),
          });
        }

        // "+5" score popup in GREEN
        const scorePopup = this.add.text(x, y, "+5", {
          fontSize: "56px",
          color: "#22c55e",
          fontFamily: "Arial Black, sans-serif",
          fontStyle: "bold",
        });
        scorePopup.setOrigin(0.5);
        scorePopup.setDepth(52);
        scorePopup.setStroke("#065f46", 4);

        // Glow ring animation
        const glowRing = this.add.graphics();
        glowRing.lineStyle(8, 0x22c55e, 0.8);
        glowRing.strokeCircle(x, y, 60);
        glowRing.setDepth(51);
        glowRing.setBlendMode(Phaser.BlendModes.ADD);

        this.tweens.add({
          targets: glowRing,
          scale: 2,
          alpha: 0,
          duration: 600,
          ease: "Cubic.easeOut",
          onComplete: () => glowRing.destroy(),
        });

        this.tweens.add({
          targets: scorePopup,
          y: y - 80,
          alpha: 0,
          scale: 1.5,
          duration: 1000,
          ease: "Back.easeOut",
          onComplete: () => scorePopup.destroy(),
        });
      }

      createXPParticles(x: number, y: number) {
        // XP particles fly to score HUD
        for (let i = 0; i < 8; i++) {
          const xp = this.add.circle(x, y, 6, 0xfbbf24);
          xp.setDepth(53);
          xp.setBlendMode(Phaser.BlendModes.ADD);

          this.tweens.add({
            targets: xp,
            x: 30 + Math.random() * 50,
            y: 30 + Math.random() * 20,
            scale: 0.5,
            duration: 800 + i * 50,
            ease: "Cubic.easeIn",
            onComplete: () => {
              xp.destroy();
              // Flash score text
              this.tweens.add({
                targets: this.scoreText,
                scale: 1.2,
                duration: 100,
                yoyo: true,
              });
            },
          });
        }
      }

      updateTimer() {
        this.timeLeft--;
        this.timerText.setText(this.timeLeft.toString());

        if (this.timeLeft <= 0) {
          this.gameOver();
        }
      }

      async gameOver() {
        this.scene.pause();
        const width = this.scale.width;
        const height = this.scale.height;

        // Save game results
        const correctAnswers = Math.floor((this.score / 5)); // 5 XP per correct
        const questionsAnswered = this.currentQuestion;
        const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

        // Save game results and trigger React completion screen
        try {
          const response = await fetch('/api/blast/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              examId: (window as any).__BLAST_EXAM_ID__ || 'unknown',
              score: this.score,
              questionsAnswered,
              correctAnswers,
              timeSeconds: 60,
              accuracy,
              streak: this.streak,
            }),
          });

          const data = await response.json();

          // Trigger React completion screen
          if ((window as any).__BLAST_ON_COMPLETE__) {
            (window as any).__BLAST_ON_COMPLETE__({
              score: this.score,
              questionsAnswered,
              correctAnswers,
              accuracy,
              streak: this.streak,
              isPersonalBest: data.isPersonalBest || false,
            });
          }
        } catch (error) {
          console.error('[Blast Game] Failed to save results:', error);
          // Still show completion even if save fails
          if ((window as any).__BLAST_ON_COMPLETE__) {
            (window as any).__BLAST_ON_COMPLETE__({
              score: this.score,
              questionsAnswered,
              correctAnswers,
              accuracy,
              streak: this.streak,
              isPersonalBest: false,
            });
          }
        }

        // Pause the game (React will handle the UI)
        this.scene.pause();
      }

      update() {
        // Rotate cannon toward mouse OR touch control override
        // Check if touch control angle is active (set from external touch controls)
        const overrideAngle = (window as any).__BLAST_TOUCH_ANGLE__;

        if (overrideAngle !== undefined && overrideAngle !== null) {
          // Use touch control angle
          const halfPI = Math.PI / 2; // 90 degrees
          const clampedAngle = Phaser.Math.Clamp(overrideAngle, -halfPI, halfPI);

          // Smooth rotation
          this.cannonSprite.rotation = Phaser.Math.Linear(
            this.cannonSprite.rotation,
            clampedAngle,
            0.15
          );
        } else {
          // Default: rotate cannon toward mouse
          const pointer = this.input.activePointer;
          const dx = pointer.x - this.spaceshipX;
          const dy = pointer.y - this.spaceshipY;

          // Calculate angle from spaceship to mouse
          // atan2(dx, -dy) gives angle where 0 is straight up, positive is clockwise
          let targetAngle = Math.atan2(dx, -dy);

          // Clamp rotation to 180° arc (from -90° to +90°)
          // This prevents the cannon from rotating backward
          const halfPI = Math.PI / 2; // 90 degrees in radians
          targetAngle = Phaser.Math.Clamp(targetAngle, -halfPI, halfPI);

          // Smooth rotation with interpolation
          this.cannonSprite.rotation = Phaser.Math.Linear(
            this.cannonSprite.rotation,
            targetAngle,
            0.15
          );
        }

        // Update asteroid positions (no hollow blobs)
        this.asteroidObjects.forEach(obj => {
          // Container position is updated by physics automatically
        });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#0A0820",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      audio: {
        noAudio: true, // Disable audio completely to prevent AudioContext errors
      },
      scene: [BlastScene],
    };

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [questions, loading, error]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-[#0A0820] via-[#1a0f3e] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading questions...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your personalized content</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-[#0A0820] via-[#1a0f3e] to-[#000000] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-6">
            💡 Tip: Take some quizzes or create flashcards to get personalized questions!
          </p>
        </div>
      </div>
    );
  }

  const handlePlayAgain = () => {
    setGameComplete(false);
    setGameStats(null);
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('BlastScene');
      if (scene) {
        scene.scene.restart();
      }
    }
  };

  // Touch control handlers
  const rotateCannon = (direction: 'left' | 'right') => {
    triggerHaptic('light'); // Haptic feedback for aim
    const step = Math.PI / 16; // ~11 degrees per tap
    setTouchAngle(prev => {
      const newAngle = direction === 'left' ? prev - step : prev + step;
      // Clamp to 180° arc (-90° to +90°)
      const clamped = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newAngle));
      // Share angle with Phaser game
      (window as any).__BLAST_TOUCH_ANGLE__ = clamped;
      return clamped;
    });
  };

  // Joystick handler
  const handleJoystickMove = (angle: number) => {
    setTouchAngle(angle);
    (window as any).__BLAST_TOUCH_ANGLE__ = angle;
  };

  const fireAtCurrentAngle = () => {
    // Get the asteroid closest to the current cannon angle
    const scene = phaserGameRef.current?.scene.getScene('BlastScene') as any;
    if (!scene || scene.locked) return;

    // Find closest asteroid to current angle
    const spaceshipX = scene.spaceshipX;
    const spaceshipY = scene.spaceshipY;
    const cannonAngle = touchAngle;

    let closestAsteroid: any = null;
    let smallestAngleDiff = Infinity;

    scene.asteroidObjects.forEach((obj: any) => {
      const dx = obj.container.x - spaceshipX;
      const dy = obj.container.y - spaceshipY;
      const asteroidAngle = Math.atan2(dx, -dy);

      const angleDiff = Math.abs(asteroidAngle - cannonAngle);
      if (angleDiff < smallestAngleDiff) {
        smallestAngleDiff = angleDiff;
        closestAsteroid = obj;
      }
    });

    // If found asteroid within reasonable angle (~30°), click it
    if (closestAsteroid && smallestAngleDiff < Math.PI / 6) {
      triggerHaptic('heavy'); // Heavy haptic for firing
      closestAsteroid.container.emit('pointerdown');
    } else {
      triggerHaptic('selection'); // Subtle feedback for missed shot
    }
  };

  // Render game
  return (
    <div className="relative w-full h-screen">
      <div ref={gameRef} className="w-full h-full" />

      {/* Top bar with close button (Quizlet style) */}
      {!gameComplete && (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/30 to-transparent">
          <div className="text-white text-sm font-medium opacity-0">Blast</div>
          <button
            onClick={onExit}
            className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Completion Screen */}
      {gameComplete && gameStats && (
        <BlastCompletion
          stats={gameStats}
          onPlayAgain={handlePlayAgain}
          onExit={onExit}
        />
      )}

      {/* MOBILE TOUCH CONTROLS - Fixed bottom, thumb-friendly zones */}
      {!gameComplete && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-blue-500/20 px-6 py-6 pb-safe z-40">
          {useJoystick ? (
            /* JOYSTICK MODE */
            <div className="flex items-center justify-between gap-8 max-w-md mx-auto">
              {/* LEFT: Virtual Joystick */}
              <VirtualJoystick
                onMove={handleJoystickMove}
                radius={60}
                size={140}
                isActive={!gameComplete}
              />

              {/* RIGHT: Fire button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onTouchStart={(e) => {
                    e.preventDefault();
                    fireAtCurrentAngle();
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex flex-col items-center justify-center active:scale-95 transition-all shadow-pop font-bold relative"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <path d="M12 2L12 6M12 18L12 22M22 12L18 12M6 12L2 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm mt-1 font-black">FIRE</span>
                </button>

                {/* Toggle to button mode */}
                <button
                  onClick={() => setUseJoystick(false)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Switch to Buttons
                </button>
              </div>
            </div>
          ) : (
            /* BUTTON MODE */
            <div>
              <div className="flex items-center justify-between gap-6 max-w-md mx-auto">
                {/* LEFT: Aim controls */}
                <div className="flex items-center gap-2">
                  <button
                    onTouchStart={(e) => {
                      e.preventDefault();
                      rotateCannon('left');
                    }}
                    className="w-14 h-14 rounded-xl bg-slate-800 border-2 border-blue-500/30 flex items-center justify-center active:scale-95 active:bg-blue-600 active:border-blue-400 transition-all shadow-soft"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button
                    onTouchStart={(e) => {
                      e.preventDefault();
                      rotateCannon('right');
                    }}
                    className="w-14 h-14 rounded-xl bg-slate-800 border-2 border-blue-500/30 flex items-center justify-center active:scale-95 active:bg-blue-600 active:border-blue-400 transition-all shadow-soft"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* CENTER: Fire button (primary action) */}
                <button
                  onTouchStart={(e) => {
                    e.preventDefault();
                    fireAtCurrentAngle();
                  }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex flex-col items-center justify-center active:scale-95 transition-all shadow-pop font-bold relative"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <path d="M12 2L12 6M12 18L12 22M22 12L18 12M6 12L2 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-xs mt-1">FIRE</span>
                </button>

                {/* RIGHT: Info/Help */}
                <div className="text-xs text-blue-300 text-center w-14">
                  <div className="mb-1">⬅️➡️</div>
                  <div>Aim</div>
                </div>
              </div>

              {/* Toggle to joystick mode */}
              <div className="text-center mt-3">
                <button
                  onClick={() => setUseJoystick(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Switch to Joystick
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Blast Completion Component
interface BlastCompletionProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onExit?: () => void;
}

function BlastCompletion({ stats, onPlayAgain, onExit }: BlastCompletionProps) {
  const getPerformance = () => {
    if (stats.accuracy >= 80) return { label: "⚡ Sharpshooter!", color: "#3b82f6" };
    if (stats.accuracy >= 60) return { label: "🎯 Great Aim!", color: "#60a5fa" };
    if (stats.accuracy >= 40) return { label: "💪 Keep Practicing!", color: "#93c5fd" };
    return { label: "🚀 Try Again!", color: "#dbeafe" };
  };

  const performance = getPerformance();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 z-50"
      onClick={onExit}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-blue-500/20"
      >
        <div className="text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
            <Zap className="w-10 h-10 text-white" fill="currentColor" strokeWidth={2} />
          </div>

          {/* Title */}
          <h2 className="font-heading text-3xl font-black mb-2 text-white">
            Game Complete!
          </h2>

          {/* Personal Best Badge */}
          {stats.isPersonalBest && (
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-bold mb-4">
              🏆 NEW PERSONAL BEST!
            </div>
          )}

          {/* Performance Label */}
          <div className="text-lg font-semibold mb-6 text-blue-300">
            {performance.label}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Score */}
            <div className="rounded-2xl bg-slate-800/50 border border-blue-500/20 p-4 backdrop-blur-sm">
              <div className="text-xs uppercase font-bold text-blue-400 mb-1" style={{ letterSpacing: '0.2em' }}>
                Score
              </div>
              <div className="font-mono font-black text-2xl text-white">
                {stats.score} <span className="text-lg text-yellow-400">XP</span>
              </div>
            </div>

            {/* Accuracy */}
            <div className="rounded-2xl bg-slate-800/50 border border-blue-500/20 p-4 backdrop-blur-sm">
              <div className="text-xs uppercase font-bold text-blue-400 mb-1" style={{ letterSpacing: '0.2em' }}>
                Accuracy
              </div>
              <div className="font-mono font-black text-2xl text-white">
                {stats.accuracy}%
              </div>
            </div>

            {/* Streak */}
            <div className="rounded-2xl bg-slate-800/50 border border-blue-500/20 p-4 backdrop-blur-sm">
              <div className="text-xs uppercase font-bold text-blue-400 mb-1" style={{ letterSpacing: '0.2em' }}>
                Best Streak
              </div>
              <div className="font-mono font-black text-2xl text-white">
                {stats.streak}
              </div>
            </div>

            {/* Questions */}
            <div className="rounded-2xl bg-slate-800/50 border border-blue-500/20 p-4 backdrop-blur-sm">
              <div className="text-xs uppercase font-bold text-blue-400 mb-1" style={{ letterSpacing: '0.2em' }}>
                Answered
              </div>
              <div className="font-mono font-black text-2xl text-white">
                {stats.correctAnswers}/{stats.questionsAnswered}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onPlayAgain}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 transition-all shadow-lg shadow-blue-500/30"
            >
              Play Again
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 px-6 transition-all"
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

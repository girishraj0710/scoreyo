"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

interface BlastGameProps {
  onExit?: () => void;
}

export default function BlastGame({ onExit }: BlastGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const QUESTIONS = [
      {
        question: "What is BLAST used for?",
        answer: "NCBI tool that compares protein or DNA sequences to other sequences in various databases",
        options: [
          "BLASTP compares an amino acid query sequence against a protein sequence database.There are op...",
          "BLAST offers a local alignment strategy having both speed and sensitivity",
          "NCBI tool that compares protein or DNA sequences to other sequences in various databases",
          "BLAST is a family of programs that allows you to input query sequence and compare it to DNA or pr...",
        ],
      },
      {
        question: "What year did WW2 end?",
        answer: "1945",
        options: ["1943", "1944", "1945", "1946"],
      },
      {
        question: "Who wrote Romeo and Juliet?",
        answer: "Shakespeare",
        options: ["Dickens", "Shakespeare", "Hemingway", "Austen"],
      },
    ];

    class BlastScene extends Phaser.Scene {
      private asteroidObjects: Array<{
        graphics: Phaser.GameObjects.Graphics;
        label: Phaser.GameObjects.Text;
        glow: Phaser.GameObjects.Graphics;
        isCorrect: boolean;
      }> = [];
      private currentQuestion = 0;
      private score = 0;
      private level = 1;
      private streak = 0;
      private timeLeft = 60;
      private locked = false;
      private questionText!: Phaser.GameObjects.Text;
      private progressBar!: Phaser.GameObjects.Graphics;
      private progressBarBg!: Phaser.GameObjects.Graphics;
      private scoreText!: Phaser.GameObjects.Text;
      private levelText!: Phaser.GameObjects.Text;
      private levelBar!: Phaser.GameObjects.Graphics;
      private levelBarBg!: Phaser.GameObjects.Graphics;
      private levelFraction!: Phaser.GameObjects.Text;
      private timerText!: Phaser.GameObjects.Text;
      private streakText!: Phaser.GameObjects.Text;
      private streakSegments!: Phaser.GameObjects.Graphics[];
      private spaceshipContainer!: Phaser.GameObjects.Container;
      private cannonSprite!: Phaser.GameObjects.Graphics;
      private spaceshipX!: number;
      private spaceshipY!: number;

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

        // Set physics world bounds (exclude header area - keep asteroids below y=220)
        this.physics.world.setBounds(0, 220, width, height - 220);

        // Cosmic background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x0a0b1e, 0x0a0b1e, 0x000000, 0x000000, 1);
        graphics.fillRect(0, 0, width, height);

        // Twinkling stars
        for (let i = 0; i < 150; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 2 + 0.5;
          const alpha = Math.random() * 0.6 + 0.2;
          const star = this.add.circle(x, y, size, 0xffffff, alpha);
          this.tweens.add({
            targets: star,
            alpha: alpha * 0.3,
            duration: 1000 + Math.random() * 2000,
            yoyo: true,
            repeat: -1,
          });
        }

        // Purple header bar
        const headerBg = this.add.rectangle(width / 2, 100, width, 180, 0x3730a3);
        headerBg.setDepth(10);

        // Question text
        this.questionText = this.add.text(width / 2, 100, "", {
          fontSize: "36px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: width - 200 },
        });
        this.questionText.setOrigin(0.5);
        this.questionText.setDepth(11);

        // Progress bar (thin line below question)
        this.progressBarBg = this.add.graphics();
        this.progressBarBg.fillStyle(0x1e1b4b, 0.5);
        this.progressBarBg.fillRect(0, 190, width, 4);
        this.progressBarBg.setDepth(10);

        this.progressBar = this.add.graphics();
        this.progressBar.setDepth(11);

        // Bottom HUD
        this.createBottomHUD();

        // Floating timer (TOP CENTER like Quizlet)
        this.timerText = this.add.text(width / 2, 280, "60", {
          fontSize: "96px",
          color: "#ffffff",
          fontFamily: "Arial Black, sans-serif",
          fontStyle: "bold",
        });
        this.timerText.setOrigin(0.5);
        this.timerText.setAlpha(0.35);
        this.timerText.setDepth(5);

        // Create spaceship at bottom center
        this.createSpaceship();

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

      createSpaceship() {
        const width = this.scale.width;
        const height = this.scale.height;
        const shipX = width / 2;
        const shipY = height - 100;

        this.spaceshipX = shipX;
        this.spaceshipY = shipY;

        // Create FIXED container (doesn't move)
        this.spaceshipContainer = this.add.container(shipX, shipY);
        this.spaceshipContainer.setDepth(38);

        // Outer glow layer
        const outerGlow1 = this.add.circle(0, 0, 85, 0x22c55e, 0.15);
        const outerGlow2 = this.add.circle(0, 0, 70, 0x22c55e, 0.25);

        // Main green cockpit ring
        const mainCockpit = this.add.circle(0, 0, 55, 0x22c55e);
        mainCockpit.setStrokeStyle(5, 0x166534);

        // Inner rings (like Quizlet)
        const ring1 = this.add.circle(0, 0, 45, 0x34d399, 0.3);
        const ring2 = this.add.circle(0, 0, 38, 0x10b981, 0.4);

        // White center circle
        const innerCircle = this.add.circle(0, 0, 28, 0xffffff, 0.95);

        // Center green glowing dot
        const centerDot = this.add.circle(0, 0, 14, 0x22c55e, 0.5);
        const centerCore = this.add.circle(0, 0, 8, 0x166534);

        // Left thruster
        const leftThruster = this.add.graphics();
        leftThruster.fillGradientStyle(0x22c55e, 0x22c55e, 0x1db4a4, 0x1db4a4, 1);
        leftThruster.fillRoundedRect(-80, -20, 12, 50, 6);

        // Right thruster
        const rightThruster = this.add.graphics();
        rightThruster.fillGradientStyle(0x22c55e, 0x22c55e, 0x1db4a4, 0x1db4a4, 1);
        rightThruster.fillRoundedRect(68, -20, 12, 50, 6);

        // ROTATING CANNON on top (like Quizlet screenshots)
        this.cannonSprite = this.add.graphics();
        this.cannonSprite.fillStyle(0xffffff, 0.9);
        // Elongated oval cannon pointing upward
        this.cannonSprite.fillEllipse(0, -40, 12, 35);
        this.cannonSprite.setDepth(44);

        // Add all parts to container
        this.spaceshipContainer.add([
          outerGlow1,
          outerGlow2,
          leftThruster,
          rightThruster,
          mainCockpit,
          ring1,
          ring2,
          innerCircle,
          centerDot,
          centerCore,
          this.cannonSprite,
        ]);

        // Pulsing animation on glows
        this.tweens.add({
          targets: [outerGlow1, outerGlow2],
          alpha: 0.5,
          duration: 1000,
          yoyo: true,
          repeat: -1,
        });

        this.tweens.add({
          targets: [leftThruster, rightThruster],
          alpha: 0.7,
          duration: 800,
          yoyo: true,
          repeat: -1,
        });
      }

      createBottomHUD() {
        const width = this.scale.width;
        const height = this.scale.height;
        const bottomY = height - 50;

        // LEFT SIDE: Level + Progress Bar
        this.levelText = this.add.text(30, bottomY, "Lvl 1", {
          fontSize: "20px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
        });
        this.levelText.setOrigin(0, 0.5);
        this.levelText.setDepth(100);

        // Level progress bar background
        this.levelBarBg = this.add.graphics();
        this.levelBarBg.fillStyle(0x1e1b4b, 0.6);
        this.levelBarBg.fillRoundedRect(110, bottomY - 10, 200, 20, 10);
        this.levelBarBg.setDepth(100);

        // Level progress bar fill
        this.levelBar = this.add.graphics();
        this.levelBar.setDepth(101);

        // Fraction text (0/50)
        this.levelFraction = this.add.text(320, bottomY, "0/50", {
          fontSize: "16px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        });
        this.levelFraction.setOrigin(0, 0.5);
        this.levelFraction.setDepth(102);

        // RIGHT SIDE: Streak + Segmented Bar
        this.streakText = this.add.text(width - 250, bottomY, "Streak", {
          fontSize: "20px",
          color: "#c084fc",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
        });
        this.streakText.setOrigin(0, 0.5);
        this.streakText.setDepth(100);

        // Streak segments (5 small rectangles)
        this.streakSegments = [];
        for (let i = 0; i < 5; i++) {
          const segment = this.add.graphics();
          segment.setDepth(100);
          this.streakSegments.push(segment);
        }

        this.updateLevelBar();
        this.updateStreakBar();
      }

      updateLevelBar() {
        const pointsInLevel = this.score % 50;
        const progress = pointsInLevel / 50;

        this.levelBar.clear();
        this.levelBar.fillGradientStyle(0xfcd34d, 0xfbbf24, 0xfcd34d, 0xfbbf24, 1);
        this.levelBar.fillRoundedRect(110, this.scale.height - 60, 200 * progress, 20, 10);

        this.levelFraction.setText(`${pointsInLevel}/50`);
        this.levelText.setText(`Lvl ${this.level}`);
      }

      updateStreakBar() {
        const width = this.scale.width;
        const bottomY = this.scale.height - 50;
        const segmentWidth = 30;
        const segmentGap = 8;

        // Update streak text with "+X" format
        if (this.streak > 0) {
          this.streakText.setText(`Streak +${this.streak}`);
        } else {
          this.streakText.setText("Streak");
        }

        this.streakSegments.forEach((segment, i) => {
          segment.clear();
          const x = width - 220 + i * (segmentWidth + segmentGap);
          const y = bottomY - 10;

          if (i < this.streak) {
            // Filled segment (pink gradient)
            segment.fillGradientStyle(0xec4899, 0xd946ef, 0xec4899, 0xd946ef, 1);
          } else {
            // Empty segment (dark)
            segment.fillStyle(0x1e1b4b, 0.6);
          }
          segment.fillRoundedRect(x, y, segmentWidth, 20, 5);
        });
      }

      loadQuestion() {
        const question = QUESTIONS[this.currentQuestion % QUESTIONS.length];
        this.questionText.setText(question.question);

        // Update progress bar
        const progress = (this.currentQuestion / QUESTIONS.length);
        this.progressBar.clear();
        this.progressBar.fillGradientStyle(0x8b5cf6, 0xd946ef, 0x8b5cf6, 0xd946ef, 1);
        this.progressBar.fillRect(0, 190, this.scale.width * progress, 4);

        // Clear existing asteroids thoroughly
        this.asteroidObjects.forEach(obj => {
          if (obj.graphics && obj.graphics.active) obj.graphics.destroy();
          if (obj.label && obj.label.active) obj.label.destroy();
          if (obj.glow && obj.glow.active) obj.glow.destroy();
        });
        this.asteroidObjects = [];

        console.log("Loading question:", question.question);
        console.log("Options:", question.options);

        const width = this.scale.width;
        const height = this.scale.height;

        // Create asteroids with good spacing (BELOW header, y >= 300)
        const positions = [
          { x: width * 0.2, y: height * 0.4 },
          { x: width * 0.5, y: height * 0.5 },
          { x: width * 0.75, y: height * 0.6 },
          { x: width * 0.35, y: height * 0.75 },
        ];

        question.options.forEach((option, index) => {
          const isCorrect = option === question.answer;
          const pos = positions[index] || { x: width / 2, y: height / 2 };
          this.createPuffyAsteroid(pos.x, pos.y, option, isCorrect);
        });
      }

      createPuffyAsteroid(x: number, y: number, text: string, isCorrect: boolean) {
        // Create puffy blob shape with many scallops
        const graphics = this.add.graphics();
        const glow = this.add.graphics();

        this.drawPuffyBlob(graphics, glow, 0, 0, 70);

        graphics.x = x;
        graphics.y = y;
        glow.x = x;
        glow.y = y;

        graphics.setDepth(20);
        glow.setDepth(19);

        // Enable physics
        this.physics.add.existing(graphics as any);
        const body = (graphics as any).body as Phaser.Physics.Arcade.Body;
        body.setCircle(70);
        body.setVelocity(
          Phaser.Math.Between(-60, 60),
          Phaser.Math.Between(-60, 60)
        );
        body.setBounce(0.8, 0.8);
        body.setCollideWorldBounds(true);

        // Add text (crisp, not blurred)
        const label = this.add.text(x, y, text, {
          fontSize: "16px",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontStyle: "600",
          align: "center",
          wordWrap: { width: 130 },
          resolution: 2, // Prevent blurring on high-DPI screens
        });
        label.setOrigin(0.5);
        label.setDepth(21);

        // Make interactive
        graphics.setInteractive(new Phaser.Geom.Circle(0, 0, 70), Phaser.Geom.Circle.Contains);
        graphics.on("pointerdown", () => {
          this.handleAsteroidClick(graphics, glow, label, isCorrect);
        });

        // Hover effect
        graphics.on("pointerover", () => {
          this.tweens.add({
            targets: [graphics, glow, label],
            scale: 1.1,
            duration: 200,
          });
        });
        graphics.on("pointerout", () => {
          this.tweens.add({
            targets: [graphics, glow, label],
            scale: 1,
            duration: 200,
          });
        });

        this.asteroidObjects.push({ graphics, label, glow, isCorrect });

        // Add collisions with other asteroids
        this.asteroidObjects.forEach(other => {
          if (other.graphics !== graphics) {
            this.physics.add.collider(graphics as any, other.graphics as any);
          }
        });
      }

      drawPuffyBlob(graphics: Phaser.GameObjects.Graphics, glow: Phaser.GameObjects.Graphics, cx: number, cy: number, radius: number) {
        const scallops = 60; // Smoother wavy circle
        const baseRadius = radius;
        const waveAmplitude = 4; // Gentle waves (not deep scallops)

        const points: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < scallops; i++) {
          const angle = (i / scallops) * Math.PI * 2;
          // Smooth sine wave for uniform wavy border
          const variation = Math.sin(i * 0.8) * waveAmplitude;
          const r = baseRadius + variation;
          points.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
          });
        }

        // Draw glow layers (stronger like Quizlet)
        glow.clear();

        // Outer glow layer
        glow.fillStyle(0x5b63d3, 0.2);
        glow.beginPath();
        glow.moveTo(points[0].x * 1.25, points[0].y * 1.25);
        for (let i = 1; i < points.length; i++) {
          glow.lineTo(points[i].x * 1.25, points[i].y * 1.25);
        }
        glow.closePath();
        glow.fillPath();

        // Middle glow layer
        glow.fillStyle(0x6d75f6, 0.3);
        glow.beginPath();
        glow.moveTo(points[0].x * 1.15, points[0].y * 1.15);
        for (let i = 1; i < points.length; i++) {
          glow.lineTo(points[i].x * 1.15, points[i].y * 1.15);
        }
        glow.closePath();
        glow.fillPath();

        // Inner glow layer
        glow.fillStyle(0x8b8bf6, 0.35);
        glow.beginPath();
        glow.moveTo(points[0].x * 1.08, points[0].y * 1.08);
        for (let i = 1; i < points.length; i++) {
          glow.lineTo(points[i].x * 1.08, points[i].y * 1.08);
        }
        glow.closePath();
        glow.fillPath();

        // Draw main solid blob
        graphics.clear();
        graphics.fillStyle(0x4c51bf, 1);
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();

        // Add border
        graphics.lineStyle(3, 0x3730a3, 1);
        graphics.strokePath();
      }

      handleAsteroidClick(
        graphics: Phaser.GameObjects.Graphics,
        glow: Phaser.GameObjects.Graphics,
        label: Phaser.GameObjects.Text,
        isCorrect: boolean
      ) {
        if (this.locked) return;
        this.locked = true;

        // Fire laser from spaceship first
        this.fireLaser(graphics.x, graphics.y);

        // Explosion happens after laser delay
        this.time.delayedCall(250, () => {
          this.createExplosion(graphics.x, graphics.y, isCorrect);
        });

        // Wait for laser + explosion, then process result
        this.time.delayedCall(300, () => {
          if (isCorrect) {
            // Correct answer
            this.score += 5;
            this.streak = Math.min(5, this.streak + 1);
            this.level = Math.floor(this.score / 50) + 1;

            this.updateLevelBar();
            this.updateStreakBar();

            // Flash green
            graphics.clear();
            glow.clear();
            this.drawPuffyBlob(graphics, glow, 0, 0, 70);
            graphics.fillStyle(0x22c55e, 1);
            graphics.fillPath();

            this.time.delayedCall(400, () => {
              graphics.destroy();
              glow.destroy();
              label.destroy();
              this.asteroidObjects = this.asteroidObjects.filter(obj => obj.graphics !== graphics);
            });

            this.time.delayedCall(800, () => {
              this.currentQuestion++;
              this.loadQuestion();
              this.locked = false;
            });
          } else {
            // Wrong answer
            this.score = Math.max(0, this.score - 2);
            this.streak = 0;

            this.updateLevelBar();
            this.updateStreakBar();

            // Flash red
            graphics.clear();
            glow.clear();
            this.drawPuffyBlob(graphics, glow, 0, 0, 70);
            graphics.fillStyle(0xef4444, 1);
            graphics.fillPath();

            this.time.delayedCall(600, () => {
              graphics.clear();
              glow.clear();
              this.drawPuffyBlob(graphics, glow, 0, 0, 70);
              this.locked = false;
            });
          }
        });
      }

      fireLaser(targetX: number, targetY: number) {
        // Calculate cannon tip position (cannon rotates, so calculate end point)
        const cannonLength = 40;
        const cannonAngle = this.cannonSprite.rotation;

        // Cannon tip coordinates
        const cannonTipX = this.spaceshipX + Math.sin(cannonAngle) * cannonLength;
        const cannonTipY = this.spaceshipY - Math.cos(cannonAngle) * cannonLength;

        console.log("LASER DEBUG:", {
          shipX: this.spaceshipX,
          shipY: this.spaceshipY,
          cannonTipX,
          cannonTipY,
          targetX,
          targetY,
          cannonAngle: Phaser.Math.RadToDeg(cannonAngle),
        });

        // Create laser using graphics from cannon tip to target
        const laser = this.add.graphics();
        laser.lineStyle(6, 0x22d3ee, 1);
        laser.beginPath();
        laser.moveTo(cannonTipX, cannonTipY);
        laser.lineTo(targetX, targetY);
        laser.strokePath();
        laser.setDepth(46);

        // Glow effect on laser
        const laserGlow = this.add.graphics();
        laserGlow.lineStyle(12, 0x67e8f9, 0.5);
        laserGlow.beginPath();
        laserGlow.moveTo(cannonTipX, cannonTipY);
        laserGlow.lineTo(targetX, targetY);
        laserGlow.strokePath();
        laserGlow.setDepth(45);

        // Fade out laser
        this.tweens.add({
          targets: [laser, laserGlow],
          alpha: 0,
          duration: 200,
          onComplete: () => {
            laser.destroy();
            laserGlow.destroy();
          },
        });

        // Flash effect at cannon tip
        const muzzleFlash = this.add.circle(cannonTipX, cannonTipY, 20, 0x22d3ee, 0.8);
        muzzleFlash.setDepth(47);
        this.tweens.add({
          targets: muzzleFlash,
          scale: 2,
          alpha: 0,
          duration: 200,
          onComplete: () => muzzleFlash.destroy(),
        });
      }

      createExplosion(x: number, y: number, isCorrect: boolean) {
        const color = isCorrect ? 0xfcd34d : 0xef4444;
        for (let i = 0; i < 15; i++) {
          const angle = (i / 15) * Math.PI * 2;
          const distance = 100;
          const particle = this.add.circle(x, y, 5, color);
          particle.setDepth(50);

          this.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            alpha: 0,
            scale: 0.3,
            duration: 700,
            onComplete: () => particle.destroy(),
          });
        }

        // Central flash
        const flash = this.add.circle(x, y, 80, color, 0.6);
        flash.setDepth(49);
        this.tweens.add({
          targets: flash,
          scale: 2,
          alpha: 0,
          duration: 500,
          onComplete: () => flash.destroy(),
        });

        // "+5" or "-2" score indicator (like Quizlet screenshot 4)
        if (isCorrect) {
          const scoreText = this.add.text(x, y, "+5", {
            fontSize: "48px",
            color: "#fcd34d",
            fontFamily: "Arial Black, sans-serif",
            fontStyle: "bold",
          });
          scoreText.setOrigin(0.5);
          scoreText.setDepth(51);
          scoreText.setAlpha(0);

          // Glowing ring animation (like Quizlet)
          const ring = this.add.graphics();
          ring.lineStyle(8, 0x60a5fa, 1);
          ring.strokeCircle(x, y, 50);
          ring.setDepth(50);
          ring.setAlpha(0);

          this.tweens.add({
            targets: ring,
            alpha: 1,
            duration: 100,
          });

          this.tweens.add({
            targets: ring,
            scale: 1.8,
            alpha: 0,
            duration: 600,
            onComplete: () => ring.destroy(),
          });

          this.tweens.add({
            targets: scoreText,
            alpha: 1,
            y: y - 60,
            duration: 800,
            ease: "Cubic.easeOut",
            onComplete: () => scoreText.destroy(),
          });
        } else {
          const scoreText = this.add.text(x, y, "-2", {
            fontSize: "48px",
            color: "#ef4444",
            fontFamily: "Arial Black, sans-serif",
            fontStyle: "bold",
          });
          scoreText.setOrigin(0.5);
          scoreText.setDepth(51);

          this.tweens.add({
            targets: scoreText,
            alpha: 0,
            y: y - 40,
            duration: 600,
            onComplete: () => scoreText.destroy(),
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

      gameOver() {
        this.scene.pause();
        const width = this.scale.width;
        const height = this.scale.height;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
        overlay.setDepth(200);

        const gameOverText = this.add.text(width / 2, height / 2 - 100, "GAME OVER", {
          fontSize: "72px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(201);

        const statsText = this.add.text(width / 2, height / 2, `Final Score: ${this.score}\nLevel: ${this.level}`, {
          fontSize: "32px",
          color: "#ffffff",
          align: "center",
        });
        statsText.setOrigin(0.5);
        statsText.setDepth(201);

        const restartButton = this.add.text(width / 2, height / 2 + 120, "RESTART", {
          fontSize: "36px",
          color: "#22c55e",
          fontStyle: "bold",
        });
        restartButton.setOrigin(0.5);
        restartButton.setDepth(201);
        restartButton.setInteractive({ useHandCursor: true });
        restartButton.on("pointerdown", () => this.scene.restart());
      }

      update() {
        // Rotate cannon to aim at mouse pointer (180° arc)
        const pointer = this.input.activePointer;
        const mouseX = pointer.x;
        const mouseY = pointer.y;

        // Calculate angle from spaceship to mouse
        const dx = mouseX - this.spaceshipX;
        const dy = mouseY - this.spaceshipY;
        let targetAngle = Math.atan2(dy, dx);

        // Convert to degrees and adjust for cannon orientation
        let angleDeg = Phaser.Math.RadToDeg(targetAngle);

        // Clamp to 180° arc (from left to right, top half only)
        // -180° (left) to 0° (right), with -90° being straight up
        if (angleDeg > 0) {
          // Bottom half - clamp to nearest side
          if (angleDeg < 90) {
            angleDeg = 0; // Right edge
          } else {
            angleDeg = 180; // Left edge
          }
        }

        // Rotate cannon smoothly
        const targetRad = Phaser.Math.DegToRad(angleDeg + 90); // +90 to point up by default
        this.cannonSprite.rotation = Phaser.Math.Linear(
          this.cannonSprite.rotation,
          targetRad,
          0.15
        );

        // Update label AND glow positions (fix hollow blobs)
        this.asteroidObjects.forEach(obj => {
          if (obj.graphics.active && obj.label.active && obj.glow.active) {
            obj.label.setPosition(obj.graphics.x, obj.graphics.y);
            obj.glow.setPosition(obj.graphics.x, obj.graphics.y);
          }
        });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#0A0B1E",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
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
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={gameRef} className="w-full h-full" />
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
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
  );
}

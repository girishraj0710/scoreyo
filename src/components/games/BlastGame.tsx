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

    // Sample questions
    const QUESTIONS = [
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
      {
        question: "What is the capital of France?",
        answer: "Paris",
        options: ["London", "Berlin", "Paris", "Madrid"],
      },
      {
        question: "What is 7 x 8?",
        answer: "56",
        options: ["48", "54", "56", "63"],
      },
      {
        question: "Who painted the Mona Lisa?",
        answer: "Leonardo da Vinci",
        options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
      },
    ];

    class BlastScene extends Phaser.Scene {
      private asteroids!: Phaser.Physics.Arcade.Group;
      private ship!: Phaser.GameObjects.Container;
      private currentQuestion!: number;
      private score!: number;
      private level!: number;
      private streak!: number;
      private timeLeft!: number;
      private questionText!: Phaser.GameObjects.Text;
      private scoreText!: Phaser.GameObjects.Text;
      private levelText!: Phaser.GameObjects.Text;
      private timerText!: Phaser.GameObjects.Text;
      private streakText!: Phaser.GameObjects.Text;
      private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
      private locked!: boolean;

      constructor() {
        super({ key: "BlastScene" });
      }

      preload() {
        // No assets needed - we'll create everything programmatically
      }

      create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Initialize game state
        this.currentQuestion = 0;
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.timeLeft = 60;
        this.locked = false;

        // Test if input is working
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
          console.log("Scene clicked at:", pointer.x, pointer.y);
        });

        // Create cosmic background
        this.createBackground();

        // Create twinkling stars
        this.createStars();

        // Create question banner
        this.createQuestionBanner();

        // Create player ship
        this.createShip();

        // Create HUD
        this.createHUD();

        // Create particle system for explosions
        this.createParticles();

        // Enable physics group BEFORE loading question
        this.asteroids = this.physics.add.group();

        // Enable collision detection between asteroids (once, not in update loop)
        this.physics.add.collider(this.asteroids, this.asteroids);

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

      createBackground() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Cosmic gradient background using fillGradientStyle
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x0f133a, 0x0f133a, 0x05081e, 0x05081e, 1);
        graphics.fillRect(0, 0, width, height);

        // Add nebula overlays
        const nebula1 = this.add.graphics();
        nebula1.fillStyle(0x581c87, 0.15);
        nebula1.fillCircle(width * 0.2, height * 0.3, 300);
        nebula1.setBlendMode(Phaser.BlendModes.ADD);

        const nebula2 = this.add.graphics();
        nebula2.fillStyle(0x2563eb, 0.15);
        nebula2.fillCircle(width * 0.8, height * 0.7, 350);
        nebula2.setBlendMode(Phaser.BlendModes.ADD);
      }

      createStars() {
        const width = this.scale.width;
        const height = this.scale.height;

        for (let i = 0; i < 100; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 2 + 1;
          const alpha = Math.random() * 0.5 + 0.3;

          const star = this.add.circle(x, y, size, 0xffffff, alpha);

          this.tweens.add({
            targets: star,
            alpha: alpha * 0.3,
            duration: 1000 + Math.random() * 1000,
            yoyo: true,
            repeat: -1,
          });
        }
      }

      createQuestionBanner() {
        const width = this.scale.width;

        // Banner background
        const banner = this.add.rectangle(width / 2, 80, width, 120, 0x1a2475);
        banner.setDepth(10);

        // Question text
        this.questionText = this.add.text(width / 2, 80, "", {
          fontSize: "28px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: width - 100 },
        });
        this.questionText.setOrigin(0.5);
        this.questionText.setDepth(11);

        // Timeline bar
        const timeline = this.add.rectangle(width / 2, 140, width, 4, 0x8b5cf6);
        timeline.setDepth(10);
      }

      createShip() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.ship = this.add.container(width / 2, height - 80);
        this.ship.setDepth(50);

        // Main cockpit
        const cockpit = this.add.circle(0, 0, 40, 0x22c55e);
        cockpit.setStrokeStyle(3, 0x166534);

        // Inner white circle
        const inner = this.add.circle(0, 0, 20, 0xffffff, 0.9);

        // Orbiting particles
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 55;
          const y = Math.sin(angle) * 55;
          const particle = this.add.circle(x, y, 3, 0x86efac, 0.8);
          this.ship.add(particle);

          // Rotate particles
          this.tweens.add({
            targets: particle,
            angle: 360,
            duration: 3000,
            repeat: -1,
          });
        }

        this.ship.add([cockpit, inner]);
      }

      createHUD() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Score (bottom left)
        this.scoreText = this.add.text(30, height - 60, "SCORE\n0", {
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "left",
        });
        this.scoreText.setDepth(100);

        // Level (bottom left)
        this.levelText = this.add.text(150, height - 60, "LEVEL\n1", {
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "left",
        });
        this.levelText.setDepth(100);

        // Timer (center floating)
        this.timerText = this.add.text(width / 2, height / 2, "60", {
          fontSize: "72px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        this.timerText.setOrigin(0.5);
        this.timerText.setAlpha(0.6);
        this.timerText.setDepth(30);

        // Streak (bottom right)
        this.streakText = this.add.text(width - 150, height - 60, "STREAK\n0", {
          fontSize: "18px",
          color: "#ec4899",
          fontStyle: "bold",
          align: "right",
        });
        this.streakText.setDepth(100);
      }

      createParticles() {
        // Create a simple texture for particles
        const graphics = this.make.graphics({ x: 0, y: 0 } as any);
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture("particle", 8, 8);
        graphics.destroy();

        // Create particle emitter
        this.particles = this.add.particles(0, 0, "particle", {
          speed: { min: 100, max: 300 },
          angle: { min: 0, max: 360 },
          scale: { start: 1, end: 0 },
          lifespan: 600,
          quantity: 12,
          blendMode: "ADD",
        });
        this.particles.setDepth(45);
      }

      loadQuestion() {
        const question = QUESTIONS[this.currentQuestion % QUESTIONS.length];
        this.questionText.setText(question.question);

        // Clear existing asteroids
        this.asteroids.clear(true, true);

        // Create asteroids for each answer
        const width = this.scale.width;
        const height = this.scale.height;

        question.options.forEach((option, index) => {
          const isCorrect = option === question.answer;
          const x = Phaser.Math.Between(100, width - 100);
          const y = Phaser.Math.Between(180, height - 250);

          this.createAsteroid(x, y, option, isCorrect);
        });
      }

      createAsteroid(x: number, y: number, text: string, isCorrect: boolean) {
        const container = this.add.container(x, y);

        // Create irregular blob shape
        const graphics = this.add.graphics();
        graphics.fillStyle(0x6366f1, 1);
        graphics.lineStyle(2, 0x4338ca, 1);

        // Draw irregular blob shape
        const segments = 24;
        const baseRadius = 60;
        const variation = 8;

        graphics.beginPath();

        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const r = baseRadius + Math.sin(i * 1.5) * variation;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;

          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }

        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        // Add glow effect
        graphics.lineStyle(8, 0x6f73ff, 0.3);
        graphics.strokePath();

        // Add text
        const label = this.add.text(0, 0, text, {
          fontSize: "16px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 100 },
        });
        label.setOrigin(0.5);

        container.add([graphics, label]);
        container.setSize(120, 120);
        container.setDepth(20); // Ensure it's above background
        container.setData("isCorrect", isCorrect);
        container.setData("text", text);

        // Make interactive FIRST (before physics)
        container.setInteractive(
          new Phaser.Geom.Circle(0, 0, 60),
          Phaser.Geom.Circle.Contains
        );

        // Enable physics AFTER setting interactive
        this.physics.add.existing(container);
        const body = container.body as Phaser.Physics.Arcade.Body;
        body.setCircle(60);
        body.setVelocity(
          Phaser.Math.Between(-50, 50),
          Phaser.Math.Between(-50, 50)
        );
        body.setBounce(1, 1);
        body.setCollideWorldBounds(true);
        container.on("pointerdown", () => {
          console.log("Asteroid clicked!", isCorrect ? "CORRECT" : "WRONG");
          this.handleAsteroidClick(container);
        });

        // Add hover effect
        container.on("pointerover", () => {
          this.tweens.add({
            targets: container,
            scale: 1.1,
            duration: 200,
          });
        });
        container.on("pointerout", () => {
          this.tweens.add({
            targets: container,
            scale: 1,
            duration: 200,
          });
        });

        this.asteroids.add(container);
      }

      handleAsteroidClick(asteroid: Phaser.GameObjects.Container) {
        console.log("handleAsteroidClick called, locked:", this.locked);
        if (this.locked) return;
        this.locked = true;

        const isCorrect = asteroid.getData("isCorrect");
        console.log("Processing click, isCorrect:", isCorrect);

        // Fire laser
        this.fireLaser(asteroid);

        this.time.delayedCall(200, () => {
          if (isCorrect) {
            // Correct answer
            this.score += 5;
            this.streak++;
            this.updateScore();
            this.explode(asteroid, true);

            // Next question
            this.time.delayedCall(500, () => {
              this.currentQuestion++;
              this.loadQuestion();
              this.locked = false;
            });
          } else {
            // Wrong answer
            this.streak = 0;
            this.updateScore();
            this.explode(asteroid, false);

            this.time.delayedCall(800, () => {
              this.locked = false;
            });
          }
        });
      }

      fireLaser(target: Phaser.GameObjects.Container) {
        const shipX = this.ship.x;
        const shipY = this.ship.y;
        const targetX = target.x;
        const targetY = target.y;

        const laser = this.add.line(
          0,
          0,
          shipX,
          shipY,
          targetX,
          targetY,
          0x36f1cd,
          1
        );
        laser.setLineWidth(4);
        laser.setDepth(40);

        this.tweens.add({
          targets: laser,
          alpha: 0,
          duration: 300,
          onComplete: () => laser.destroy(),
        });
      }

      explode(asteroid: Phaser.GameObjects.Container, correct: boolean) {
        const color = correct ? 0xfcd34d : 0xef4444;

        // Emit particles
        this.particles.setParticleTint(color);
        this.particles.emitParticleAt(asteroid.x, asteroid.y, 12);

        // Flash and scale animation
        this.tweens.add({
          targets: asteroid,
          scale: 0,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            if (correct) {
              asteroid.destroy();
            } else {
              asteroid.setScale(1);
              asteroid.setAlpha(1);
            }
          },
        });
      }

      updateScore() {
        this.scoreText.setText(`SCORE\n${this.score}`);
        this.levelText.setText(`LEVEL\n${this.level}`);
        this.streakText.setText(`STREAK\n${this.streak}`);

        // Level up every 50 points
        if (this.score % 50 === 0 && this.score > 0) {
          this.level++;
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

        // Game over overlay
        const overlay = this.add.rectangle(
          width / 2,
          height / 2,
          width,
          height,
          0x000000,
          0.8
        );
        overlay.setDepth(200);

        const gameOverText = this.add.text(
          width / 2,
          height / 2 - 100,
          "GAME OVER",
          {
            fontSize: "64px",
            color: "#ffffff",
            fontStyle: "bold",
          }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(201);

        const statsText = this.add.text(
          width / 2,
          height / 2,
          `Final Score: ${this.score}\nLevel Reached: ${this.level}\nBest Streak: ${this.streak}`,
          {
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
          }
        );
        statsText.setOrigin(0.5);
        statsText.setDepth(201);

        const restartButton = this.add.text(
          width / 2,
          height / 2 + 100,
          "RESTART",
          {
            fontSize: "32px",
            color: "#22c55e",
            fontStyle: "bold",
          }
        );
        restartButton.setOrigin(0.5);
        restartButton.setDepth(201);
        restartButton.setInteractive({ useHandCursor: true });
        restartButton.on("pointerdown", () => {
          this.scene.restart();
        });
      }

      update() {
        // Game loop runs at 60fps
        // Physics is handled automatically by Phaser
      }
    }

    // Phaser game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#05081E",
      physics: {
        default: "arcade",
        arcade: {
          debug: true, // Enable physics debug visualization
          debugShowBody: true,
          debugShowVelocity: true,
        },
      },
      scene: [BlastScene],
    };

    // Create game instance
    phaserGameRef.current = new Phaser.Game(config);

    // Cleanup on unmount
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

      {/* Exit button overlay */}
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

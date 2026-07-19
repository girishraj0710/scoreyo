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
      private asteroidObjects: Array<{ circle: Phaser.GameObjects.Arc; label: Phaser.GameObjects.Text }> = [];
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
      private locked!: boolean;

      constructor() {
        super({ key: "BlastScene" });
      }

      preload() {
        // No assets needed
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

        // Create HUD
        this.createHUD();

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

        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x0f133a, 0x0f133a, 0x05081e, 0x05081e, 1);
        graphics.fillRect(0, 0, width, height);
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

        const banner = this.add.rectangle(width / 2, 80, width, 120, 0x1a2475);
        banner.setDepth(10);

        this.questionText = this.add.text(width / 2, 80, "", {
          fontSize: "28px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: width - 100 },
        });
        this.questionText.setOrigin(0.5);
        this.questionText.setDepth(11);
      }

      createHUD() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.scoreText = this.add.text(30, height - 60, "SCORE\n0", {
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        this.scoreText.setDepth(100);

        this.levelText = this.add.text(150, height - 60, "LEVEL\n1", {
          fontSize: "18px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        this.levelText.setDepth(100);

        this.timerText = this.add.text(width / 2, height / 2, "60", {
          fontSize: "72px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        this.timerText.setOrigin(0.5);
        this.timerText.setAlpha(0.6);
        this.timerText.setDepth(30);

        this.streakText = this.add.text(width - 150, height - 60, "STREAK\n0", {
          fontSize: "18px",
          color: "#ec4899",
          fontStyle: "bold",
        });
        this.streakText.setDepth(100);
      }

      loadQuestion() {
        const question = QUESTIONS[this.currentQuestion % QUESTIONS.length];
        this.questionText.setText(question.question);

        // Clear existing asteroids
        this.asteroidObjects.forEach(obj => {
          obj.circle.destroy();
          obj.label.destroy();
        });
        this.asteroidObjects = [];

        const width = this.scale.width;
        const height = this.scale.height;

        // Create asteroids with spacing to avoid initial overlap
        const positions = [
          { x: width * 0.25, y: height * 0.4 },
          { x: width * 0.75, y: height * 0.4 },
          { x: width * 0.25, y: height * 0.7 },
          { x: width * 0.75, y: height * 0.7 },
        ];

        question.options.forEach((option, index) => {
          const isCorrect = option === question.answer;
          const pos = positions[index] || { x: width / 2, y: height / 2 };

          this.createAsteroid(pos.x, pos.y, option, isCorrect);
        });
      }

      createAsteroid(x: number, y: number, text: string, isCorrect: boolean) {
        // Create circle with physics
        const circle = this.add.circle(x, y, 60, 0x6366f1) as Phaser.GameObjects.Arc;
        circle.setStrokeStyle(4, 0x4338ca);
        circle.setDepth(20);

        // Enable physics
        this.physics.add.existing(circle);
        const body = circle.body as Phaser.Physics.Arcade.Body;
        body.setCircle(60);
        body.setVelocity(
          Phaser.Math.Between(-100, 100),
          Phaser.Math.Between(-100, 100)
        );
        body.setBounce(1, 1);
        body.setCollideWorldBounds(true);
        body.setCollideWorldBounds(true, 1, 1); // Add world bounds collision with bounce

        // Add text
        const label = this.add.text(x, y, text, {
          fontSize: "16px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "center",
        });
        label.setOrigin(0.5);
        label.setDepth(21);

        // Make circle interactive
        circle.setInteractive();
        circle.on("pointerdown", () => {
          console.log("Asteroid clicked!", isCorrect ? "CORRECT" : "WRONG");
          this.handleAsteroidClick(circle, label, isCorrect);
        });

        // Hover effect
        circle.on("pointerover", () => {
          circle.setScale(1.1);
          label.setScale(1.1);
        });
        circle.on("pointerout", () => {
          circle.setScale(1.0);
          label.setScale(1.0);
        });

        // Store reference
        this.asteroidObjects.push({ circle, label });

        // Enable collision with other asteroids
        this.asteroidObjects.forEach(other => {
          if (other.circle !== circle) {
            this.physics.add.collider(circle, other.circle);
          }
        });
      }

      handleAsteroidClick(circle: Phaser.GameObjects.Arc, label: Phaser.GameObjects.Text, isCorrect: boolean) {
        if (this.locked) return;
        this.locked = true;

        console.log("Processing click, isCorrect:", isCorrect);

        // Create explosion effect
        this.createExplosion(circle.x, circle.y, isCorrect);

        if (isCorrect) {
          // Correct answer
          this.score += 5;
          this.streak++;
          console.log("Score updated:", this.score, "Streak:", this.streak);
          this.updateScore();

          // Flash green
          circle.setFillStyle(0x22c55e);
          label.setColor("#ffffff");

          // Destroy asteroid after delay
          this.time.delayedCall(300, () => {
            circle.destroy();
            label.destroy();
            // Remove from array
            this.asteroidObjects = this.asteroidObjects.filter(obj => obj.circle !== circle);
          });

          // Next question
          this.time.delayedCall(800, () => {
            this.currentQuestion++;
            this.loadQuestion();
            this.locked = false;
          });
        } else {
          // Wrong answer
          this.score = Math.max(0, this.score - 2);
          this.streak = 0;
          console.log("Score updated:", this.score, "Streak:", this.streak);
          this.updateScore();

          // Flash red
          circle.setFillStyle(0xef4444);
          label.setColor("#ffffff");

          this.time.delayedCall(400, () => {
            // Restore color
            circle.setFillStyle(0x6366f1);
            this.locked = false;
          });
        }
      }

      createExplosion(x: number, y: number, isCorrect: boolean) {
        const color = isCorrect ? 0xfcd34d : 0xef4444;
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2;
          const distance = 80;
          const particle = this.add.circle(x, y, 4, color);
          particle.setDepth(50);

          this.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            alpha: 0,
            scale: 0.5,
            duration: 600,
            onComplete: () => particle.destroy(),
          });
        }
      }

      updateScore() {
        console.log("Updating score display - Score:", this.score, "Level:", this.level, "Streak:", this.streak);

        // Force immediate text update
        this.scoreText.setText(`SCORE\n${this.score}`);
        this.levelText.setText(`LEVEL\n${this.level}`);
        this.streakText.setText(`STREAK\n${this.streak}`);

        // Level up every 50 points
        const newLevel = Math.floor(this.score / 50) + 1;
        if (newLevel !== this.level) {
          this.level = newLevel;
          this.levelText.setText(`LEVEL\n${this.level}`);

          // Flash level text
          this.tweens.add({
            targets: this.levelText,
            scale: 1.3,
            duration: 200,
            yoyo: true,
          });
        }

        // Flash score text on update
        this.tweens.add({
          targets: this.scoreText,
          scale: 1.2,
          duration: 150,
          yoyo: true,
        });
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

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        overlay.setDepth(200);

        const gameOverText = this.add.text(width / 2, height / 2 - 100, "GAME OVER", {
          fontSize: "64px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(201);

        const statsText = this.add.text(
          width / 2,
          height / 2,
          `Final Score: ${this.score}\nLevel Reached: ${this.level}`,
          {
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
          }
        );
        statsText.setOrigin(0.5);
        statsText.setDepth(201);

        const restartButton = this.add.text(width / 2, height / 2 + 100, "RESTART", {
          fontSize: "32px",
          color: "#22c55e",
          fontStyle: "bold",
        });
        restartButton.setOrigin(0.5);
        restartButton.setDepth(201);
        restartButton.setInteractive({ useHandCursor: true });
        restartButton.on("pointerdown", () => {
          this.scene.restart();
        });
      }

      update() {
        // Update label positions to follow circles
        this.asteroidObjects.forEach(obj => {
          if (obj.circle.active && obj.label.active) {
            obj.label.setPosition(obj.circle.x, obj.circle.y);
          }
        });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#05081E",
      physics: {
        default: "arcade",
        arcade: {
          debug: false, // Disable debug visualization
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

"use client";

import { useEffect, useRef } from "react";

type HabitatCanvasProps = {
  reducedMotion: boolean;
};

export function HabitatCanvas({ reducedMotion }: HabitatCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let game: { destroy: (removeCanvas: boolean) => void } | undefined;

    void import("phaser").then(({ default: Phaser }) => {
      const host = hostRef.current;
      if (disposed || !host) return;

      class FernEdgeScene extends Phaser.Scene {
        create() {
          const graphics = this.add.graphics();
          graphics.fillStyle(0x1e3d35, 1).fillRect(0, 0, 640, 360);
          graphics.fillStyle(0x587246, 1).fillRect(0, 254, 640, 106);
          graphics.fillStyle(0x8da865, 1);
          for (let index = 0; index < 18; index += 1) {
            const x = 18 + index * 38;
            graphics.fillTriangle(
              x,
              264,
              x + 20,
              178 + (index % 3) * 22,
              x + 34,
              264,
            );
          }
          graphics.fillStyle(0xf2c56e, 1).fillEllipse(320, 226, 188, 70);
          graphics.fillTriangle(276, 204, 301, 116, 326, 204);
          graphics.fillTriangle(315, 198, 337, 98, 359, 198);
          graphics.fillTriangle(352, 203, 370, 126, 388, 203);
          graphics.fillRect(270, 250, 22, 70).fillRect(375, 250, 22, 70);
          graphics.fillTriangle(227, 231, 159, 202, 253, 247);
          this.add.text(28, 26, "FERN EDGE", {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#f3efe4",
          });
          this.add.text(28, 52, "Learn the body before the floodplain opens.", {
            fontFamily: "Arial",
            fontSize: "13px",
            color: "#d4ddd2",
          });
          if (!reducedMotion) {
            this.tweens.add({
              targets: graphics,
              alpha: { from: 0.88, to: 1 },
              duration: 1600,
              yoyo: true,
              repeat: -1,
            });
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: host,
        width: 640,
        height: 360,
        backgroundColor: "#1e3d35",
        scene: FernEdgeScene,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      });
    });

    return () => {
      disposed = true;
      game?.destroy(true);
    };
  }, [reducedMotion]);

  return (
    <div
      className="habitat-canvas"
      ref={hostRef}
      aria-label="Fern Edge habitat visualization"
      role="img"
    />
  );
}

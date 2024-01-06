import { Position } from "vis-network/peer";

export class WorkSpaceCanvasUtil {

  drawArrowToLeftOfCircle(ctx: CanvasRenderingContext2D, position: Position) {
    // creating arrow for start state

    // arrow is drawn from left to right, pointing to right
    const x1 = position.x - 30; // moving the tip of the arrow to meet the border
    const y1 = position.y;
    const x2 = position.x - 90; // dx for starting point of non pointing end of arrow
    const y2 = position.y;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#2B7CE9";
    ctx.stroke();

    const startRadians =
      Math.atan((y2 - y1) / (x2 - x1)) +
      ((x2 >= x1 ? -90 : 90) * Math.PI) / 180;

    ctx.save();
    ctx.beginPath();
    ctx.translate(x1, y1);
    ctx.rotate(startRadians);
    ctx.moveTo(0, 0);
    ctx.lineTo(5, 18);
    ctx.lineTo(0, 16);
    ctx.lineTo(-5, 18);
    ctx.closePath();
    ctx.restore();
    ctx.fillStyle = "#2B7CE9";
    ctx.fill();

    ctx.save();
  }

  drawOuterCircle(ctx: CanvasRenderingContext2D, positions: Position[]) {
    // create outer circle for final states

    ctx.strokeStyle = "#2B7CE9";
    positions.forEach(position => {
      ctx.beginPath();
      ctx.arc(
        position.x,
        position.y,
        36,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    });

    ctx.save();
  }
}
import Game from "@views/rung/Game";

export default async function Room({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  return <Game roomId={roomId} />;
}

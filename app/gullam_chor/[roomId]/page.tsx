import Game from "@views/gullam_chor/Game";

export default async function Room({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  return <Game roomId={roomId} />;
}

const PlayerCard = ({ player }: { player: { name: string; cardsCount: number } }) => (
  <div className="bg-green-800/40 backdrop-blur-md rounded-2xl p-3 text-white shadow-xl border border-green-600/30 flex flex-col items-center min-w-[120px]">
    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-lg font-bold mb-2">
      {player.name[0].toUpperCase()}
    </div>
    <div className="text-center">
      <h3 className="text-sm font-semibold">{player.name}</h3>
      <p className="text-green-300 text-xs">Cards: {player.cardsCount}</p>
    </div>
  </div>
);

export default PlayerCard;

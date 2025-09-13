// import useLegsGame from '~/hooks/use-legs-game';
//
// const Legs = () => {
//   const { game } = useLegsGame();
//
//   const onCreatePlayer = (e) => {
//     e.preventDefault();
//     const attributes = Object.fromEntries(new FormData(e.target));
//     game.createPlayer(attributes);
//   };
//
//   return (
//     <>
//       <div>game id: {game.id}</div>
//       <div>players: {game.players?.length}</div>
//       <ul>
//         {game.players?.map((player) => player.name)}
//       </ul>
//       <form onSubmit={onCreatePlayer}>
//         <label htmlFor="name">name:</label>
//         <input name="name"/>
//         <label htmlFor="splash">splash:</label>
//         <input name="splash"/>
//         <button type="submit">create</button>
//       </form>
//     </>
//   );
// };
//
// export default Legs;

// import { useEffect, useState, useRef } from 'react';
//
// import LegsGame from '~/lib/legs/legs-game';
//
// const useLegsGame = () => {
//   console.log('running hook');
//   const [, forceUpdate] = useState(false);
//   const [foo, setFoo] = useState(1);
//   const barRef = useRef(1);
//   const setBar = (val) => {
//     barRef.current = val;
//     forceUpdate(prev => !prev);
//   };
//
//   const gameRef = useRef(null);
//
//   useEffect(() => {
//     if (!gameRef.current) {
//       const observe = () => forceUpdate(prev => !prev);
//       gameRef.current = LegsGame.create({ id: 'main', observe });
//       observe();
//     }
//   }, [gameRef]);
//
//   return { foo, setFoo, bar: barRef.current, setBar, game: gameRef.current || {} };
// };
//
// export default useLegsGame;

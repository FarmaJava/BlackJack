import { useEffect, useState } from 'react'

function App() {
  const [screen, setScreen] = useState(false)
  const [baraja, setBaraja] = useState( { deck_id: "", remaining: 0 } )
  const [cartas, setCartas] = useState([{}])
  const [points, setPoints] = useState(0)
  let b = 0;

  useEffect(() => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
      .then(res => res.json())
      .then(data => {
        console.log("Baraja creada:", data);
        setBaraja(data);
      })
  }, [])

  const dealCard = () => {
    if (baraja) {
      fetch(`https://deckofcardsapi.com/api/deck/${baraja.deck_id}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
          console.log("Carta robada:", data);
          setCartas(prevCartas => [...prevCartas, ...data.cards]);

          const a = [...cartas, ...data.cards];

          if (b == 1) {
            setPoints(a.reduce((acc, carta) => {
            let valor = carta.value;
            if (valor === 'JACK' || valor === 'QUEEN' || valor === 'KING') {
              return acc + 10;
            } else if (valor === 'ACE') {
              return acc + 11; // Simplificación: siempre cuenta como 11
            } else {
              return acc + parseInt(valor);
            }
          }, 0))
          }

        })
                  b = 1;
    }
  }

  return (
    <>
      <div id="root" className={screen ? "pantalla-juego" : "pantalla-inicio"}>
        {!screen ? (

          <div className='container'>
            <img src='../resource/StartGame1.png' className='bannerstart' />
            <button onClick={() => {setScreen(true)}}>Iniciar Juego</button>
          </div>

        ) : (
          
          <div className='container'>
            <div className='dealer'>
              <img src='../resource/dealer.png' className='bannerdealer' />

            </div>
            <div className='player'>
              <div className='cards-player'>
                {cartas.map((carta, index) => (
                  <img key={index} src={carta.image} className='card-image' />
                ))}
              </div>
              <button onClick={() => {dealCard()}}>Hit</button>
              <span onChange={() => (console.log("a"))}>puntaje:{points}</span>
            </div>
            
          </div>

        )}
      </div>
    </>
  )
}

export default App

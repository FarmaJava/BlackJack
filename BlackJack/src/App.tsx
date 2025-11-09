import { useEffect, useState } from 'react'

function App() {
  const [screen, setScreen] = useState(false)
  const [baraja, setBaraja] = useState()
  const [cartas, setCartas] = useState([])
  const [cartasDealer, setCartasDealer] = useState([])
  const [dealerPoints, setDealerPoints] = useState(0)
  const [botonDealer, setBotonDealer] = useState(false)
  const [points, setPoints] = useState(0)
  const [creditos, setCreditos] = useState(1000)
  const [puedeGanar, setPuedeGanar] = useState(true);
  let puntosDealer = 0;
  let puntos = 0;
  let ultimacarta = '';

  if (creditos <= 0) {
    alert("Te has quedado sin creditos! El juego se reiniciara.");
    setScreen(false);
    setCreditos(1000);
    setCartas([]);
    setCartasDealer([]);
    setPoints(0);
    setDealerPoints(0);
    setBotonDealer(false);
  }

if (creditos >= 2000 && puedeGanar) {
  setPuedeGanar(false);
  alert("¡Felicidades! Has alcanzado los $2000. Eres un maestro del BlackJack!, toma tu monito 🙉");
  setCartas([]);
  setPoints(0);
}

if (creditos < 2000 && !puedeGanar) {
  setPuedeGanar(true);
}


  const stanCards = () => {
    alert(`Has decidido plantarte con un puntaje de ${points}. Turno del dealer.`);
    setBotonDealer(true);
    sacarCartaDealer();
  }

  const sacarCartaDealer = () => {
        fetch(`https://deckofcardsapi.com/api/deck/${baraja.deck_id}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
          console.log("Carta robada:", data);
          setCartasDealer(prevCartas => [...prevCartas, ...data.cards])
          const a = [...cartasDealer, ...data.cards];
          if (a.length > 0) {
              setDealerPoints(a.reduce((acc, carta) => {
                let valor = carta.value;
                ultimacarta = valor;
                if (valor === 'JACK' || valor === 'QUEEN' || valor === 'KING') {
                  puntosDealer = acc + 10;
                  console.log(puntosDealer);
                  return acc + 10;
                } else if (valor === 'ACE') {
                  puntosDealer = acc + 11;
                  console.log(puntosDealer);
                  return acc + 11; // Simplificación: siempre cuenta como 11
                } else {
                  puntosDealer = acc + parseInt(valor);
                  console.log(puntosDealer);
                  return acc + parseInt(valor);
                }
              }, 0))
            }
          verificarPuntajeDealer();
        })
  }

  const verificarPuntajeDealer = () => {
    console.log(puntosDealer);
    if (puntosDealer >= points && puntosDealer <= 21) {
      alert(`El dealer gana con un puntaje de ${puntosDealer}, le salio un ${ultimacarta} contra tu puntaje de ${points}.`);
      setCreditos(creditos - 300);
      setCartas([]);
      setCartasDealer([]);
      setPoints(0);
      setDealerPoints(0);
      setBotonDealer(false);
    } else if ( puntosDealer > 21) {
      alert(`El dealer se ha pasado de 21 con un puntaje de ${puntosDealer} con una carta ${ultimacarta}. ¡Felicidades, ganaste!`);
      setCreditos(creditos + 300);
      setCartas([]);
      setCartasDealer([]);
      setPoints(0);
      setDealerPoints(0);
      setBotonDealer(false);
    }
  }

  const verificarPuntaje = () => {
    console.log(puntos);
    if (puntos > 21) {
      alert(`Te has pasado de 21! te salio ${ultimacarta}, tu Pierdes.`);
      setCreditos(creditos - 300);
      setCartas([]);
      setPoints(0);
    } else if (puntos === 21) {
      alert(`¡Blackjack! te salio ${ultimacarta} ¡Felicidades, ganaste!`);
      setCreditos(creditos + 300);
      setCartas([]);
      setPoints(0);
    }
  }

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

          if (a.length > 0) {
              setPoints(a.reduce((acc, carta) => {
                let valor = carta.value;
                ultimacarta = valor;
                if (valor === 'JACK' || valor === 'QUEEN' || valor === 'KING') {
                  puntos = acc + 10;
                  return acc + 10;
                } else if (valor === 'ACE') {
                  puntos = acc + 11;
                  return acc + 11; // Simplificación: siempre cuenta como 11
                } else {
                  puntos = acc + parseInt(valor);
                  return acc + parseInt(valor);
                }
              }, 0))
            }
          verificarPuntaje();
        })
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
            <div style={{backgroundColor:"darkgreen", borderRadius: '4px', color:'white', padding:'5px', marginBottom:'10px', border:'2px solid #d4af37'}}>
              <div>Credito:${creditos}</div>
              <div>Ronda = $300</div>
              <div>$2000 = 🙉Monito</div>
            </div>
            <div className='dealer'>
              <img src='../resource/dealer.png' className='bannerdealer' />
              <div className='cards-player'>
                {cartasDealer.map((carta, index) => (
                  <img key={index} src={carta.image} className='card-image' />
                ))}
              </div>
            <span style={{backgroundColor: 'darkgreen', borderRadius: '4px'}}>Puntaje Dealer:{dealerPoints}</span>
            <div>{!botonDealer ? (
              null
            ):(
              <button onClick={() => {sacarCartaDealer()}}>Siguiente Carta</button>
            )}</div>
            </div>

            <div className='player'>
              <div className='cards-player'>
                {cartas.map((carta, index) => (
                  <img key={index} src={carta.image} className='card-image' />
                ))}
              </div>

              <button onClick={() => {dealCard()}}>Hit</button>
              <button onClick={() => {stanCards()}}>Stan</button>
              <span >Puntaje:{points}</span>
            </div>
          </div>  
        )}
      </div>
    </>
  )
}

export default App

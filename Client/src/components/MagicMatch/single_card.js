import './single_card.css'

function SingleCard({card, handleChoice, flipped, disabled}){

  const handleClick = () => {
    if(!disabled){
    handleChoice(card)
    }
  }

    return(
        <div className="card" id={card.id}>
            <div className={flipped ? "flipped" : ""}>
              <img className='front' src={card.src} alt='card front'></img>
              <img 
              className='back' 
              src="./magicmatchimages/cover.png" 
              onClick={handleClick} 
              alt='card back'></img>
            </div>
          </div>
    )
}
export default SingleCard
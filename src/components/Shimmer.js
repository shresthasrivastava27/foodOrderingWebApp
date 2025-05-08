import { shimmer_card_unit } from "../utils/constants";

const CardShimmer = () => {
    return (
        <div className="shimmer-card">
            <div className="shimmer-img stroke animate"></div>
            <div className="shimmer-title stroke animate"></div>
            <div className="shimmer-tags stroke animate"></div>
            <div className="shimmer-details stroke animate"></div>
        </div>
  )
}

const Shimmer = () => {
  return (
    <div className='shimmer-container'>
        {new Array(shimmer_card_unit).fill(0).map((item, i) => {
           return <CardShimmer key={i}/>
        })}
    </div>
  )
}

export default Shimmer
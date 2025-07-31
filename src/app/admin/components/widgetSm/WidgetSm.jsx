'use client'
import { Visibility } from "@mui/icons-material"
import "./widgetSm.css"

function WidgetSm() {
  const clients = [
    { name: "Société Transit Sud", secteur: "Import textile" },
    { name: "Global Shipping", secteur: "Export pièces auto" },
    { name: "Tunis Customs Partner", secteur: "Consulting douanier" },
  ]

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">Nouveaux Clients</span>
      <ul className="widgetSmList">
        {clients.map((client, idx) => (
          <li className="widgetSmListItem" key={idx}>
            {/* Sans image */}
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{client.name}</span>
              <span className="widgetSmUserTitle">{client.secteur}</span>
            </div>
            <button className="widgetSmButton">
              <Visibility className="widgetSmIcon" />
              Consulter
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WidgetSm


// 'use client'
// import { Visibility } from "@material-ui/icons"
// import "./widgetSm.css"
// import Achraf from "./img/1.PNG";

// function WidgetSm() {
//     return (
//         <div>
//           <div className="widgetSm">
//               <span className="widgetSmTitle">
//                   New Join Members</span>
//             <ul className="widgetSmList">
//                 <li className="widgetSmListItem">
//                     <img src={Achraf} alt="" className="widgetSmImg" />
//                   <div className="widgetSmUser">
//                       <span className="widgetSmUsername">Achraf bokri</span>
//                       <span className="widgetSmUserTitle">Software Developper</span>

//                   </div>
//                   <button className="widgetSmButton">
//                       <Visibility className="widgetSmIcon"/>
//                       Display
//                   </button>
//                 </li>
//                  <li className="widgetSmListItem">
//                     <img src={Achraf} alt="" className="widgetSmImg" />
//                   <div className="widgetSmUser">
//                       <span className="widgetSmUsername">Achraf bokri</span>
//                       <span className="widgetSmUserTitle">Software Developper</span>

//                   </div>
//                   <button className="widgetSmButton">
//                       <Visibility className="widgetSmIcon"/>
//                       Display
//                   </button>
//                 </li>
//                 <li className="widgetSmListItem">
//                     <img src={Achraf} alt="" className="widgetSmImg" />
//                   <div className="widgetSmUser">
//                       <span className="widgetSmUsername">Achraf bokri</span>
//                       <span className="widgetSmUserTitle">Software Developper</span>

//                   </div>
//                   <button className="widgetSmButton">
//                       <Visibility className="widgetSmIcon"/>
//                       Display
//                   </button>
//                 </li>
//                 </ul>      
                    
//           </div>  
//         </div>
//     )
// }

// export default WidgetSm

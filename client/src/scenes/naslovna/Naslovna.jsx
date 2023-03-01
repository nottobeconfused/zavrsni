import React from 'react'
import NavTop from '../nav-top'
import Navigacija from '../navigacija'
import '../../App.css';
import Objava from '../../components/Objava/Objava';

const Naslovna = () => {

  const Grupe = [
    { 
        imeGrupe: 'Grupa1', 
        nazivZadatka: "Novi zadatak",
        tekst: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?",
        od: "11.2.2023",
        do: "3.3.2023.",
    },
    { 
        imeGrupe: 'Grupa2', 
        nazivZadatka: "Novi zadatak2",
        tekst: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?",
        od: "23.2.2023",
        do: "3.4.2023.",
    },
    { 
        imeGrupe: 'Grupa2', 
        nazivZadatka: "Novi zadatak3",
        tekst: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?",
        od: "24.2.2023",
        do: "13.4.2023.",
    },
    { 
        imeGrupe: 'Grupa2', 
        nazivZadatka: "Novi zadatak2",
        tekst: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?",
        od: "23.2.2023",
        do: "3.4.2023.",
    },
    { 
        imeGrupe: 'Grupa2', 
        nazivZadatka: "Novi zadatak2",
        tekst: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?",
        od: "23.2.2023",
        do: "3.4.2023.",
    },
    { 
        imeGrupe: 'Grupa2', 
        nazivZadatka: "Novi zadatak2",
        tekst: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi aliquam deserunt itaque architecto enim assumenda, odio corporis! Nam architecto voluptas ea ex repellat nulla, expedita veniam soluta, ad maiores dicta?",
        od: "23.2.2023",
        do: "3.4.2023.",
    },
  ];
    return (
        <>
        <Navigacija />
        <NavTop />
        <div className="main">
        {Grupe.map(item => (
            <Objava item={item}/>
          ))}
        </div>
        </>
    )
}

export default Naslovna;
function regionVisibility(arrElem, callBackFunc) {
    
    const isVisible = (idElem) => {
        let elem = document.getElementById(idElem)
        return elem.getBoundingClientRect().top < window.innerHeight && elem.getBoundingClientRect().bottom > 0 
    }
    
    window.addEventListener('scroll', () => {
        let arrElemProp = []

        arrElem.forEach(e => 
            arrElemProp.push(
                {
                    "region": e.id,
                    "visible": isVisible(e.id)
                }
            )
        )
        try {
            callBackFunc(arrElemProp)
        } catch (e) {
            console.warn('Error to execute callback function')
            console.warn(e)
        }
    });    
}


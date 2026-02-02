/**********************************************************************************
    LeafStrenght [Provisional name] - Generate mesocycles easily.
    Copyright (C) 2025 Manu Montaraz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
**********************************************************************************/

/*************************************************************************************
    
 
 */

let languageLoaded = false
let exercisesLoaded = false

const version = document.querySelector("html").getAttribute("data-version")
const [exercises,muscles,categories,equipments,positions,measurements] = await getExercises().then(data => data)
const buttonSpanish = document.querySelector("#button_spanish")
const buttonEnglish = document.querySelector("#button_english")
const buttonNewMesocycle = document.querySelector("#button_new_mesocycle")
const buttonCancelNewMesocycle = document.querySelector("#button_new_mesocycle_cancel")
const buttonNextNewMesocycle = document.querySelector("#button_new_mesocycle_next")
const buttonBackNewMesocycle = document.querySelector("#button_new_mesocycle_back")
const buttonAcceptNewMesocycle = document.querySelector("#button_new_mesocycle_accept")
const buttonsSavePresetNewMesocycle = document.querySelectorAll(".button_new_mesocycle_save_preset")
const buttonsLoadPresetNewMesocycle = document.querySelectorAll(".button_new_mesocycle_load_preset")
const buttonBackMesocyclePage1 = document.querySelector("#button_mesocycle_back_page1")
const buttonBackMesocyclePage2 = document.querySelector("#button_mesocycle_back_page2")
const elementLoader = document.querySelector("#loader")
const containerYourMesocycles = document.querySelector("#your_mesocycles")
const containerNewMesocycle = document.querySelector("#new_mesocycle")
const containerNewMesocyclePage2 = document.querySelector("#new_mesocycle_page2")
const containerContainerMesocyclePage1 = document.querySelector("#container_mesocycle_page1")
const containerContainerMesocyclePage2 = document.querySelector("#container_mesocycle_page2")
const containerModals = document.querySelector("#container_modals")

let yourMesocycles// = await getYourMesocycles()

console.log({exercises})
console.log({muscles})
console.log({categories})
console.log({equipments})
console.log({positions})
console.log({measurements})

//console.log({yourMesocycles})
//alert(JSON.stringify(yourMesocycles))

init()

function init(){
    
    // Inicializa la aplicación:
    // - Carga los ejercicios en el DOM
    // - Configura el idioma según preferencia del usuario
    // - Actualiza la lista de mesociclos del usuario
    // - Configura los eventos de los botones y campos
    // - Habilita o deshabilita botones de la primera página del formulario


    loadExercises()
    setLanguage(getLanguage())
    updateYourMesocycles()
    setEvents()
    disableEnableNewMesocyclePage1Buttons()
}

///////////////////////////////////////////////////////////////////////////////

async function getExercises() {

    // Obtiene los ejercicios desde un archivo JSON
    // Procesa la lista para agregar un ID único a cada ejercicio
    // Genera listas únicas de músculos, categorías, equipos, posiciones y mediciones
    // Marca que los ejercicios han sido cargados y verifica si se puede ocultar el loader

    const response = await fetch('exercises.json')
    const exercises = (await response.json()).map((exercise, index) => ({...exercise,id: index})).sort((a, b) => a.category.localeCompare(b.category))

    const muscles = [...new Set(exercises.flatMap((exercise)=>exercise.muscle))]
    const categories = [...new Set(exercises.flatMap((exercise)=>exercise.category))]
    const equipments = [...new Set(exercises.flatMap((exercise)=>exercise.equipment))]
    const positions = [...new Set(exercises.flatMap((exercise)=>exercise.position))]
    const measurements = [...new Set(exercises.flatMap((exercise)=>exercise.measurement))]

    if(!exercisesLoaded){
        exercisesLoaded = true
        checkLoad()
    }

    return [exercises,muscles,categories,equipments,positions,measurements]
}

function loadExercises(){

    // Carga los ejercicios en la interfaz
    // - Inserta elementos de búsqueda y filtros
    // - Inserta cada ejercicio en la lista con sus detalles y opciones
    // - Configura eventos de filtrado y selección de ejercicios

    const containerExerciseList = containerNewMesocyclePage2.querySelector("#exercise_list")
    containerExerciseList.innerHTML = `
        <li id="exercise_list_search">
            <input id="search_exercise_title" type="text" translation="placeholder|search">
            <select id="search_exercise_muscles">
                <option value="" translation="text|muscles"></option>
            </select>
            <select id="search_exercise_categories">
                <option value="" translation="text|categories"></option>
            </select>
            <select id="search_exercise_equipments">
                <option value="" translation="text|equipments"></option>
            </select>
            <select id="search_exercise_positions">
                <option value="" translation="text|positions"></option>
            </select>
            <select id="search_exercise_measurements">
                <option value="" translation="text|measurements"></option>
            </select>
        </li>
    `
    
    const selectMuscles = document.querySelector("#search_exercise_muscles")
    const selectCategories = document.querySelector("#search_exercise_categories")
    const selectEquipments = document.querySelector("#search_exercise_equipments")
    const selectPositions = document.querySelector("#search_exercise_positions")
    const selectMeasurements = document.querySelector("#search_exercise_measurements")

    for(let indexMuscles = 0 ; indexMuscles < muscles.length ; indexMuscles++){
        const muscle = muscles[indexMuscles]
        selectMuscles.insertAdjacentHTML("beforeend",`<option value="${muscle}" translation="text|muscle_${muscle}"></option>`)
    }

    for(let indexCategories = 0 ; indexCategories < categories.length ; indexCategories++){
        const category = categories[indexCategories]
        selectCategories.insertAdjacentHTML("beforeend",`<option value="${category}" translation="text|category_${category}"></option>`)
    }

    for(let indexEquipments = 0 ; indexEquipments < equipments.length ; indexEquipments++){
        const equipment = equipments[indexEquipments]
        selectEquipments.insertAdjacentHTML("beforeend",`<option value="${equipment}" translation="text|equipment_${equipment}"></option>`)
    }

    for(let indexPositions = 0 ; indexPositions < positions.length ; indexPositions++){
        const position = positions[indexPositions]
        selectPositions.insertAdjacentHTML("beforeend",`<option value="${position}" translation="text|position_${position}"></option>`)
    }

    for(let indexMeasurements = 0 ; indexMeasurements < measurements.length ; indexMeasurements++){
        const measurement = measurements[indexMeasurements]
        selectMeasurements.insertAdjacentHTML("beforeend",`<option value="${measurement}" translation="text|measurement_${measurement}"></option>`)
    }

    for(let indexExercise = 0 ; indexExercise < exercises.length ; indexExercise++){
        const exercise = exercises[indexExercise]
        //exercise.id = exercises.findIndex(exercise=>exercise.title=="exercise_pushUp")

        console.log(exercise)

        containerNewMesocyclePage2.querySelector("#exercise_list").innerHTML += `
            <li id="exercise_list_${exercise.id}" class="exercise searchable">
                <h2 search="title" translation="text|${exercise.title}"></h2>
                <div class="exercise_container">
                    <h6 translation="text|for"></h6>
                    <p search="title" translation="text|category_${exercise.category}"></p>
                    <p translation="text|muscle_${exercise.muscle}"></p>
                </div>
                <div class="exercise_container">
                    <h6 translation="text|equipment">${translate("equipment")}:</h6>
                    ${exercise.equipment
                        .map(equipment => `
                            <div>
                                <label for="exercise_${exercise.id}_equipment_${equipment}" translation="text|equipment_${equipment}"></label>
                                <input type="checkbox" id="exercise_${exercise.id}_equipment_${equipment}" name="exercise_${exercise.id}_equipment_${equipment}">
                            </div>`)
                        .join('')
                    }
                </div>
                <div class="exercise_container">
                    <h6 translation="text|position"></h6>
                    ${exercise.position
                        .map(position => `
                            <div>
                                <label for="exercise_${exercise.id}_position_${position}" translation="text|position_${position}"></label>
                                <input type="checkbox" id="exercise_${exercise.id}_position_${position}" name="exercise_${exercise.id}_position_${position}">
                            </div>`)
                        .join('')
                    }
                </div>
                <div class="exercise_container">
                    <h6 translation="text|measurement">${translate("measurement")}:</h6>
                    ${exercise.measurement
                        .map(measurement => `
                            <div>
                                <label for="exercise_${exercise.id}_measurement_${measurement}" translation="text|measurement_${measurement}"></label>
                                <input type="checkbox" id="exercise_${exercise.id}_measurement_${measurement}" name="exercise_${exercise.id}_measurement_${measurement}">
                            </div>`)
                        .join('')
                    }
                </div>
            </li>
        `
    }

    setExercisesEvents()
}

function setExercisesEvents(){

    // Configura los eventos de búsqueda y filtrado de ejercicios
    // - Detecta cambios en el input de búsqueda y selects de filtros
    // - Filtra los ejercicios visibles según los criterios
    // - Actualiza el estado de los botones de la página 2 del mesociclo

    const searchExercise = document.querySelector("#search_exercise_title")
    const selectMuscles = document.querySelector("#search_exercise_muscles")
    const selectCategories = document.querySelector("#search_exercise_categories")
    const selectEquipments = document.querySelector("#search_exercise_equipments")
    const selectPositions = document.querySelector("#search_exercise_positions")
    const selectMeasurements = document.querySelector("#search_exercise_measurements")

    const elementExerciseList = document.querySelector("#exercise_list")
    const elementsExercises = elementExerciseList.querySelectorAll(".exercise")

    const getValue = () => {
        return [
            searchExercise.value,
            (selectMuscles.value?selectMuscles.querySelector(`option[value=${selectMuscles.value}]`).textContent:undefined),
            (selectCategories.value?selectCategories.querySelector(`option[value=${selectCategories.value}]`).textContent:undefined),
            (selectEquipments.value?selectEquipments.querySelector(`option[value=${selectEquipments.value}]`).textContent:undefined),
            (selectPositions.value?selectPositions.querySelector(`option[value=${selectPositions.value}]`).textContent:undefined),
            (selectMeasurements.value?selectMeasurements.querySelector(`option[value=${selectMeasurements.value}]`).textContent:undefined)
        ]
    }

    const search = (element, searchValues) => {
        if (!element.classList.contains("searchable")) {
            console.warn(translate("error_element_not_searchable"))
            return
        }
        
        const text = element.textContent.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const terms = Array.isArray(searchValues) ? searchValues : [searchValues]
        const cleanTerms = terms.filter(Boolean).map(term => term.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        const matches = cleanTerms.every(term => text.includes(term))

        element.classList.toggle("hide", !matches)
    }

    searchExercise.addEventListener("input",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
    })

    selectMuscles.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectCategories.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectEquipments.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectPositions.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    selectMeasurements.addEventListener("change",(event)=>{
        const value = getValue()

        elementExerciseList.classList.add("hide")
        for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
            search(elementsExercises[indexExercise],value)
        }
        elementExerciseList.classList.remove("hide")
        //console.log(value)
    })

    disableEnableNewMesocyclePage2Buttons()
}

function disableEnableNewMesocyclePage2Buttons(){

    // Habilita o deshabilita el botón de aceptar mesociclo según si
    // todos los ejercicios requeridos están seleccionados
    // Marca los ejercicios como "activos" si todos sus campos están completados

    const elementExerciseList = document.querySelector("#exercise_list")
    const elementsExercises = elementExerciseList.querySelectorAll(".exercise")

    for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){

        const elementExercice = elementsExercises[indexExercise]

        elementExercice.addEventListener("change",(event)=>{
            const id = event.target.id.split("_")[1]
            console.log({id})

            const groups = elementExercice.querySelectorAll(".exercise_container:has(input)")
            console.log({groups})

            const inputs = [...groups].map(group=>group.querySelectorAll("input"))
            console.log({inputs})

            const isFull = ![...inputs].map(input=>[...input].map(input=>input.checked === true).some(Boolean)).includes(false)
            console.log({isFull})

            if(isFull)elementExercice.classList.add("active")
            else elementExercice.classList.remove("active")

            if(elementExerciseList.querySelector(".active") === null)buttonAcceptNewMesocycle.setAttribute("disabled","")
            else buttonAcceptNewMesocycle.removeAttribute("disabled")

            disableEnableNewMesocyclePage1Buttons()
        })
    }
}

function disableEnableNewMesocyclePage1Buttons(){

    // Habilita o deshabilita los botones de navegación y guardar preset
    // de la primera página del formulario según los inputs requeridos y presets disponibles

    const requiredInputs = containerNewMesocycle.querySelectorAll("input:not([type=button])[required],select[required]")
    const requiredInputsWithValue = [...requiredInputs].filter(input=>input.value)

    console.log({requiredInputs},requiredInputs.length,{requiredInputsWithValue},requiredInputsWithValue.length)

    if(requiredInputsWithValue.length === requiredInputs.length)buttonNextNewMesocycle.removeAttribute("disabled")
    else buttonNextNewMesocycle.setAttribute("disabled","")

    if(localStorage.getItem("mesocyclePresets"))buttonsLoadPresetNewMesocycle.forEach(button => button.removeAttribute("disabled"))
    else buttonsLoadPresetNewMesocycle.forEach(button => button.setAttribute("disabled",""))

    if(!buttonNextNewMesocycle.hasAttribute("disabled") && !buttonAcceptNewMesocycle.hasAttribute("disabled"))buttonsSavePresetNewMesocycle.forEach(button => button.removeAttribute("disabled"))
    else buttonsSavePresetNewMesocycle.forEach(button => button.setAttribute("disabled",""))
}

function getLanguage() {

    // Obtiene el idioma preferido del usuario
    // - Primero intenta desde localStorage
    // - Luego usa la configuración del navegador
    // - Devuelve un código corto de idioma válido (en, es, fr, etc.)

    let lang = localStorage.getItem("language") || navigator.language || navigator.userLanguage || 'en'
    
    lang = lang.toLowerCase()

    if(lang.startsWith("en")) lang = "en"
    else if(lang.startsWith("es")) lang = "es"
    else if(lang.startsWith("fr")) lang = "fr"
    else if(lang.startsWith("de")) lang = "de"
    else if(lang.startsWith("it")) lang = "it"
    else if(lang.startsWith("pt")) lang = "pt"
    else if(lang.startsWith("ru")) lang = "ru"
    else lang = "en"
    
    return lang
}

function setLanguage(language=getLanguage()){

    // Configura el idioma de la aplicación
    // - Carga traducciones desde localStorage si existen y coinciden con la versión
    // - Si no, obtiene el JSON correspondiente y guarda los datos en localStorage
    // - Traduce los elementos del DOM con atributo [translation]

    if(localStorage.getItem('language') === language && localStorage.getItem('version') === version){
        const elementsTranslation = document.querySelectorAll("[translation]")

        translate(elementsTranslation)

        if(!languageLoaded){
            languageLoaded = true
            checkLoad()
        }
    }else{
        localStorage.setItem('language', language)
        localStorage.setItem('version', version)
        document.querySelector("html").lang = language

        fetch(`./lang/${language}.json`)
        .then(response => response.json())
        .then(data => {

            console.log("Language loaded:", language, data)
            localStorage.setItem('languageData', JSON.stringify(data))
            localStorage.setItem('version', version)

            const elementsTranslation = document.querySelectorAll("[translation]")

            translate(elementsTranslation)

            if(!languageLoaded){
                languageLoaded = true
                checkLoad()
            }
        })
    }
}

function translate(toTranslate){

    // Traduce elementos o cadenas según los datos de idioma cargados
    // - Soporta traducción de texto, HTML, placeholder, title, value y atributos
    // - Si no hay idioma cargado, llama a setLanguage()

    if(!localStorage.getItem('language')){
        setLanguage(getLanguage())
        return
    }

    const dataTranslation = JSON.parse(localStorage.getItem("languageData"))

    if(typeof toTranslate === "object"){
        for(let indexElementTranslation = 0 ; indexElementTranslation < toTranslate.length ; indexElementTranslation++){
            const elementTranslation = toTranslate[indexElementTranslation]

            const translations = elementTranslation.getAttribute("translation").split(",")

            for(let indexTranslation = 0 ; indexTranslation < translations.length ; indexTranslation++){
                const translation = translations[indexTranslation].trim()
                const [method, key, extra] = translation.split("|")

                switch(method){
                    case "text":
                        elementTranslation.textContent = dataTranslation[key] ?? key
                    break
                    case "html":
                        elementTranslation.innerHTML = dataTranslation[key] ?? key
                    break
                    case "placeholder":
                        elementTranslation.placeholder = dataTranslation[key] ?? key
                    break
                    case "title":
                        elementTranslation.title = dataTranslation[key] ?? key
                    break
                    case "value":
                        elementTranslation.value = dataTranslation[key] ?? key
                    break
                    case "attribute":
                        if(extra) elementTranslation.setAttribute(extra, dataTranslation[key] ?? key)
                        else console.warn(`No attribute specified for translation key "${key}"`)
                    break
                    default:
                        console.warn(`Translation method "${method}" not recognized`)
                    break
                }
            }
        }
    }else if(toTranslate){
        return dataTranslation[toTranslate] ?? toTranslate
    }
}

function checkLoad(){

    // Verifica si el idioma y los ejercicios ya fueron cargados
    // Si ambos están listos, oculta el loader

    console.log({languageLoaded},{exercisesLoaded})
    if(languageLoaded && exercisesLoaded){
        elementLoader.style.display = "none"
    }
}

function showContainer(container){
    
    // Muestra un contenedor específico y oculta los demás

    const containers = document.querySelectorAll(".container:not(.hide)")

    for(let indexContainers = 0 ; indexContainers < containers.length ; indexContainers++){
        containers[indexContainers].classList.add("hide")
    }

    container.classList.remove("hide")
}

function setEvents(){
    
    // Configura eventos de la interfaz principal:
    // - Inputs del formulario de mesociclo
    // - Botones de cambio de idioma
    // - Botones de navegación entre contenedores
    // - Guardado y carga de presets

    containerNewMesocycle.addEventListener("input",(event)=>{

        const input = event.target

        console.log(input)

        if(["input","select"].includes(input.localName) && input.getAttribute("type") === "button")return //NO CUENTA

        if(input.id === "new_mesocycle_structure"){
            //TO-DO: ACTUALIZAR ESTRUCTURA EN containerNewMesocyclePage2 (Weider y Fullbody = Oculto | Torso - Pierna = (Tirón y Empuje = Torso) | Tirón - Empuje - Pierna = Predeterminado)
        }

        disableEnableNewMesocyclePage1Buttons()
    })

    buttonSpanish.addEventListener("click", (event)=>{
        event.preventDefault()
        setLanguage('es')
    })

    buttonEnglish.addEventListener("click", (event)=>{
        event.preventDefault()
        setLanguage('en')
    })

    buttonNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        showContainer(containerNewMesocycle)
    })

    buttonCancelNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        showContainer(containerYourMesocycles)
    })

    for(let indexButtonSavePreset = 0 ; indexButtonSavePreset < buttonsSavePresetNewMesocycle.length ; indexButtonSavePreset++){
        const buttonSavePreset = buttonsSavePresetNewMesocycle[indexButtonSavePreset]
        buttonSavePreset.addEventListener("click",(event)=>{
            event.preventDefault()
            savePreset()
        })
    }

    for(let indexButtonLoadPreset = 0 ; indexButtonLoadPreset < buttonsLoadPresetNewMesocycle.length ; indexButtonLoadPreset++){
        const buttonLoadPreset = buttonsLoadPresetNewMesocycle[indexButtonLoadPreset]
        buttonLoadPreset.addEventListener("click",(event)=>{
            event.preventDefault()
            loadPresets()
            openModal("modal_presets")
        })
    }

    buttonNextNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        //TO-DO: CALCULAR EJERCICIOS SI NO ESTÁN YA!
        //RETURN SI *REQUIRED* ESTÁ VACÍO
        //ACTUALIZAR ESTRUCTURA EN containerNewMesocyclePage2 (Weider y Fullbody = Oculto | Torso - Pierna = (Tirón y Empuje = Torso) | Tirón - Empuje - Pierna = Predeterminado)

        const options = getInputValues(containerNewMesocycle,"new_mesocycle_")

        console.log({options})

        if(options === undefined || typeof options === "string")return //TO-DO: GESTIONAR ERRORES

        /* TO-DO: ESTO HARÍA FALTA? (COMPROBACIÓN DE OBJETIVOS Y MICROCICLOS)
        switch(options.objective){
            case "strength":
                if(options.total_microcycle < 4){
                    alert(translate("error_strength_min_microcycles"))
                    return
                }
            break
        }
        */

        switch(options.structure){
            case "weider":
                if(options.sessions_microcycle < 5){
                    alert(translate("error_weider_min_sessions"))
                    return
                }
                if(options.sessions_microcycle % 5 !== 0){
                    alert(translate("error_weider_sessions_multiple"))
                    return
                }
            break
            case "upper-lower":
                if(options.sessions_microcycle < 2){
                    alert(translate("error_upperLower_min_sessions"))
                    return
                }
                if(options.sessions_microcycle % 2 !== 0){
                    alert(translate("error_upperLower_sessions_multiple"))
                    return
                }
            break
            case "push-pull-legs":
                if(options.sessions_microcycle < 3){
                    alert(translate("error_pushPullLegs_min_sessions"))
                    return
                }
                if(options.sessions_microcycle % 3 !== 0){
                    alert(translate("error_pushPullLegs_sessions_multiple"))
                    return
                }
            break
        }

        //
        showContainer(containerNewMesocyclePage2)
    })

    buttonBackNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        showContainer(containerNewMesocycle)
    })

    buttonAcceptNewMesocycle.addEventListener("click", (event)=>{
        event.preventDefault()
        //alert(translate("error_not_implemented_yet"))

        newMesocycle()
    })

    buttonBackMesocyclePage1.addEventListener("click", (event)=>{
        event.preventDefault()
        showContainer(containerYourMesocycles)
    })

    containerModals.addEventListener("click",(event)=>{
        event.preventDefault()
        
        if(event.target !== containerModals)return

        closeModal()
    })
}

function getInputValues(container,replaceId="",needActive){
    
    // Obtiene los valores de inputs y selects dentro de un contenedor
    // - Puede filtrar solo los elementos activos si needActive es true
    // - Devuelve un objeto con las opciones o un código de error si falta un input requerido

    if(!container)return

    const selector = needActive ? ".active input,.active select" : "input,select"

    const inputs = container.querySelectorAll(selector)
    const options = {}

    for(let indexInputs = 0 ; indexInputs < inputs.length ; indexInputs++){
        const input = inputs[indexInputs]
        if(input.getAttribute("type") == "button")continue
        const key = input.id.replace(replaceId,"")
        const value = input.getAttribute("type") == "radio" || input.getAttribute("type") == "checkbox" ? input.checked : input.value
        if(input.hasAttribute("required") && (!value || value == "")){
            //TO-DO: GESTION ERRORES
            // buttonNextNewMesocycle.setAttribute("disabled","")
            alert("PLACEHOLDER || INPUT REQUERIDO")
            return `required_item_${indexInputs}`//ALERTA X INPUT ES REQUERIDO
        }
        else if(!value)continue
        options[key] = value
    }

    return options
}

function reduceOptionExercises(optionsExercises){
    
    // Convierte el objeto de opciones de ejercicios en una estructura
    // agrupando por número de ejercicio y categoría (equipment, position, measurement)

    return Object.entries(optionsExercises).reduce((accumulator, [key, value]) => {
        if (!value) return accumulator
        const [, num, category, item] = key.split("_")

        if (!accumulator[num]) {
            accumulator[num] = { equipment: [], position: [], measurement: [] }
        }

        accumulator[num][category].push(item)

        return accumulator
    }, {})
}

function openIndexedDB() {
    
    // Abre o crea la base de datos IndexedDB "yourMesocyclesDB"
    // - Crea el objectStore "yourMesocycles" si no existe

    const request = indexedDB.open("yourMesocyclesDB", 1)

    request.onupgradeneeded = (e) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains("yourMesocycles")) {
            db.createObjectStore("yourMesocycles")
        }
    }

    return request
}

function getYourMesocycles(){
    
    // Obtiene los mesociclos guardados del usuario desde IndexedDB
    // - Devuelve una promesa que resuelve con la lista de mesociclos
    // - Actualiza la variable global yourMesocycles

    const request = openIndexedDB()

    const promiseRequest = new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error)

        request.onsuccess = (e) => {
            const db = e.target.result
            const transaction = db.transaction("yourMesocycles", "readonly")
            const objectStore = transaction.objectStore("yourMesocycles")
            const getRequest = objectStore.get("yourMesocycles")

            getRequest.onerror = () => reject(getRequest.error)

            getRequest.onsuccess = () => {
                const result = getRequest.result
                if (!result) {
                    resolve([])
                    return
                }

                try {
                    const parsed = typeof result === "string" ? JSON.parse(result) : result
                    resolve(parsed)
                } catch (err) {
                    reject(err)
                }
            };

            transaction.onerror = () => reject(transaction.error)
        };
    })

    let response = promiseRequest.then((data) => {
        console.log("Mesocycles retrieved successfully:", data)
        yourMesocycles = data
        console.log(yourMesocycles)
        return data
    }).catch((error) => {
        console.error("Error retrieving mesocycles:", error)
        return []
    })

    

    return response

}

function addToYourMesocycles(mesocycle){

    // Agrega un nuevo mesociclo al almacenamiento del usuario
    // - Obtiene la lista existente
    // - Agrega el nuevo mesociclo
    // - Guarda la lista actualizada en IndexedDB
    // - Actualiza la lista en la interfaz

    const mesoscycles = getYourMesocycles()

    mesoscycles.then((mesoscycles) => {

        console.log(mesoscycles)
        
        mesoscycles.push(mesocycle)

        const request = openIndexedDB()

        request.onsuccess = function(event) {

            const db = event.target.result

            const transaction = db.transaction("yourMesocycles", "readwrite")
            const objectStore = transaction.objectStore("yourMesocycles")

            objectStore.put(mesoscycles, "yourMesocycles")

            transaction.oncomplete = function() {
                console.log("Mesocycle added successfully")
            }

            transaction.onerror = function(event) {
                console.error("Error adding mesocycle:", event.target.error)
            }

            
            updateYourMesocycles()
        }
    })
}

function newMesocycle(){
    
    // Crea un nuevo mesociclo a partir de los valores del formulario
    // - Calcula la estructura de sesiones y microciclos
    // - Asigna ejercicios a cada sesión
    // - Guarda el mesociclo en IndexedDB
    // - Muestra la lista de mesociclos del usuario

    const mesocycle = getInputValues(containerNewMesocycle,"new_mesocycle_")
    const total_microcycle = parseInt(mesocycle.total_microcycle)
    const sessions_microcycle = parseInt(mesocycle.sessions_microcycle)
    const objective = mesocycle.objective

    mesocycle.exercises = reduceOptionExercises(getInputValues(containerNewMesocyclePage2,undefined,true))
    delete mesocycle.total_microcycle
    delete mesocycle.sessions_microcycle

    mesocycle.microcycles = []

    const structure = []
    switch(mesocycle.structure){
        case "fullbody":
            structure.push("fullbody")
        break
        case "upper-lower":
            structure.push("upper")
            structure.push("lower")
        break
        case "push-pull-legs":
            structure.push("push")
            structure.push("pull")
            structure.push("legs")
        break
        case "weider":
            structure.push("chest")
            structure.push("back")
            structure.push("legs")
            structure.push("shoulders")
            structure.push("arms")
        break
    }
    for(let indexTotalMicrocycle = 0 ; indexTotalMicrocycle < total_microcycle ; indexTotalMicrocycle++){
        const microcycle = {}
        const [intensity, rir, rpe, sets, reps] = getDataMicrocycle([indexTotalMicrocycle+1,total_microcycle],objective)

        for(let indexSessionsMicrocycle = 0 ; indexSessionsMicrocycle < sessions_microcycle ; indexSessionsMicrocycle++){
            const session = microcycle[indexSessionsMicrocycle] = {}
            session.structure = structure[indexSessionsMicrocycle % structure.length]
            session.intensity = intensity
            session.rir = rir
            session.rpe = rpe
            session.sets = sets
            session.reps = reps
            session.exercises = Object.keys(mesocycle.exercises) //TO-DO: ASIGNAR EJERCICIOS A CADA SESIÓN SEGÚN ESTRUCTURA
            session.done = false
        }
        mesocycle.microcycles.push(microcycle)
    }

    console.log({mesocycle},"sessions_microcycle:",sessions_microcycle,"total_microcycle:",total_microcycle)

    //localStorage.setItem("yourMesocycles",JSON.stringify([...yourMesocycles,mesocycle]))

    addToYourMesocycles(mesocycle)


    showContainer(containerYourMesocycles)
}

function getDataMicrocycle(arrayActualTotalMicrocycle,objective){
    
    // Calcula los parámetros de cada microciclo según el objetivo:
    // - intensidad, RIR, RPE, sets y reps
    // - Realiza un cálculo progresivo entre el mínimo y máximo definido

    const intensityMinMax = [60,95]
    const rirMinMax = [4,0]
    const rpeMinMax = [5,10]
    const setsMinMax = [3,6]
    const repsMinMax = [6,3]

    const calculeValues = (minMax)=>{
        //TO-DO: No siempre se querrá dividir entre 2 en el deload
        //TO-DO: REVISAR CÁLCULO DEL DELAOD
        return Math.ceil(arrayActualTotalMicrocycle[0] === arrayActualTotalMicrocycle[1] ? minMax[1] / 2 : minMax[0] + (arrayActualTotalMicrocycle[0] - 1)/(arrayActualTotalMicrocycle[1] - 2) * (minMax[1] - minMax[0]))
    }

    switch(objective){ //TO-DO: AJUSTAR VALORES REALES
        case "strength":
            intensityMinMax[0] = 60
            intensityMinMax[1] = 95

            rirMinMax[0] = 4
            rirMinMax[1] = 0

            rpeMinMax[0] = 7
            rpeMinMax[1] = 10

            setsMinMax[0] = 4
            setsMinMax[1] = 4

            repsMinMax[0] = 6
            repsMinMax[1] = 3
        break
        case "hypertrophy":
            intensityMinMax[0] = 50
            intensityMinMax[1] = 80

            rirMinMax[0] = 3
            rirMinMax[1] = 1

            rpeMinMax[0] = 6
            rpeMinMax[1] = 9

            setsMinMax[0] = 5
            setsMinMax[1] = 4

            repsMinMax[0] = 12
            repsMinMax[1] = 8
        break
        case "endurance":
            intensityMinMax[0] = 40
            intensityMinMax[1] = 70

            rirMinMax[0] = 5
            rirMinMax[1] = 2

            rpeMinMax[0] = 5
            rpeMinMax[1] = 8

            setsMinMax[0] = 2
            setsMinMax[1] = 4

            repsMinMax[0] = 16
            repsMinMax[1] = 10
        break
        case "definition":
            intensityMinMax[0] = 40
            intensityMinMax[1] = 70

            rirMinMax[0] = 5
            rirMinMax[1] = 2

            rpeMinMax[0] = 5
            rpeMinMax[1] = 8

            setsMinMax[0] = 2
            setsMinMax[1] = 4

            repsMinMax[0] = 16
            repsMinMax[1] = 10
        break
        case "maintenance":
            intensityMinMax[0] = 40
            intensityMinMax[1] = 70

            rirMinMax[0] = 5
            rirMinMax[1] = 2

            rpeMinMax[0] = 5
            rpeMinMax[1] = 8

            setsMinMax[0] = 2
            setsMinMax[1] = 4

            repsMinMax[0] = 16
            repsMinMax[1] = 10
        break
        case "bilbo":
            intensityMinMax[0] = 40
            intensityMinMax[1] = 70

            rirMinMax[0] = 5
            rirMinMax[1] = 2

            rpeMinMax[0] = 5
            rpeMinMax[1] = 8

            setsMinMax[0] = 2
            setsMinMax[1] = 4

            repsMinMax[0] = 16
            repsMinMax[1] = 10
        break
    }

    const intensity = calculeValues(intensityMinMax)
    const rir = calculeValues(rirMinMax)
    const rpe = calculeValues(rpeMinMax)
    const sets = calculeValues(setsMinMax)
    const reps = calculeValues(repsMinMax)

    return [intensity,rir,rpe,sets,reps]
}

function enterMesocycle(indexMesocycle){
    
    // Abre un mesociclo existente del usuario
    // - Muestra la página de detalle del mesociclo
    // - Obtiene el microciclo actual y la sesión pendiente
    // - Carga los ejercicios correspondientes en la interfaz

    showContainer(containerContainerMesocyclePage1)

    const microcyclesList = containerContainerMesocyclePage1.querySelector("#microcycles_list")
    const mesocycle = yourMesocycles[indexMesocycle]
    const microcycle = mesocycle.microcycles.flatMap(microcycle => Object.values(microcycle)).find(day=> day.done === false)
    const exercisesMicrocycle = microcycle.exercises

    console.log("microcycle",microcycle,microcycle.length)
    console.log("exercises",exercisesMicrocycle,exercisesMicrocycle.length)

    containerContainerMesocyclePage1.querySelector("#mesocycle_name").textContent = mesocycle.name
    containerContainerMesocyclePage1.querySelector("#mesocycle_total_microcycle").textContent = mesocycle.microcycles.length
    containerContainerMesocyclePage1.querySelector("#mesocycle_current_microcycle").textContent = mesocycle.microcycles.findIndex(microcycle => Object.values(microcycle).some(day => day === microcycle)) + 2
    containerContainerMesocyclePage1.querySelector("#mesocycle_current_session").textContent = Object.values(microcycle).findIndex(day => day === microcycle) + 2
    containerContainerMesocyclePage1.querySelector("#mesocycle_total_session").textContent = Object.values(microcycle).length

    microcyclesList.innerHTML = ""
    for(let indexExercises = 0 ; indexExercises < exercisesMicrocycle.length ; indexExercises++){
        const exerciseKey = parseInt(exercisesMicrocycle[indexExercises])
        const exercise = exercises.find(exercise=>exercise.id === exerciseKey)

        console.log({exercise})
        console.log({exerciseKey})

        //TO-DO: SELECCIONAR EJERCICIOS SEGÚN ESTRUCTURA Y OTROS PARÁMETROS

        microcyclesList.insertAdjacentHTML(
            "beforeend",
            `<li class="exercise">
                <h2 translation="text|${exercise?.title}">${translate(`${exercise?.title}`)}</h2>
                <p><span translation="text|for">${translate(`for`)}</span><span>: </span><span translation="text|category_${exercise?.category}">${translate(`category_${exercise?.category}`)}</span></p>
                <p translation="text|muscle_${exercise?.muscle}">${translate(`muscle_${exercise?.muscle}`)}</p>
            </li>`
        )
    }
}

async function updateYourMesocycles(){
    
    // Actualiza la lista de mesociclos del usuario en la interfaz
    // - Obtiene la lista de IndexedDB
    // - Inserta cada mesociclo con botones de entrar y eliminar

    //TO-DO: ACTUALIZAR LA LISTA DE MESOCICLOS DEL USUARIO
    const mesocyclesList = containerYourMesocycles.querySelector("#mesocycles_list")

    yourMesocycles = await getYourMesocycles()

    console.log({yourMesocycles})

    mesocyclesList.innerHTML = ""

    for(let indexYourMesocycles = 0 ; indexYourMesocycles < yourMesocycles.length ; indexYourMesocycles++){
        const mesocycle = yourMesocycles[indexYourMesocycles]
        //TO-DO: OBTENER MICROCICLO ACTUAL, SESIÓN ACTUAL, ETC...

        console.log({mesocycle})

        mesocyclesList.insertAdjacentHTML(
            "beforeend",
            `<div class="mesocycle">
                <h2>${mesocycle.name}</h2>
                <p><span translation="text|mesocycle_structure">${translate("mesocycle_structure")}</span>: <span translation="text|mesocycle_structure_${mesocycle.structure}">${translate(`mesocycle_structure_${mesocycle.structure}`)}</span></p>
                <p><span translation="text|mesocycle_objective">${translate("mesocycle_objective")}</span>: <span translation="text|mesocycle_objective_${mesocycle.objective}">${translate(`mesocycle_objective_${mesocycle.objective}`)}</span></p>
                <p><span translation="text|mesocycle_total_microcycle">${translate("mesocycle_total_microcycle")}</span>: ${mesocycle.microcycles.length}</p>
                <button class="accept" translation="text|enter">${translate("enter")}</button>
                <button class="cancel" translation="text|delete">${translate("delete")}</button>
            </div>`
        )

        const buttonsAccept = mesocyclesList.querySelectorAll(".mesocycle .accept")
        const buttonsCancel = mesocyclesList.querySelectorAll(".mesocycle .cancel")

        for(let indexButtonAccept = 0 ; indexButtonAccept < buttonsAccept.length ; indexButtonAccept++){
            const buttonAccept = buttonsAccept[indexButtonAccept]
            buttonAccept.onclick = ((event)=>{
                event.preventDefault()
                enterMesocycle(indexButtonAccept)
            })
        }

        for(let indexButtonCancel = 0 ; indexButtonCancel < buttonsCancel.length ; indexButtonCancel++){
            const buttonCancel = buttonsCancel[indexButtonCancel]
            buttonCancel.onclick = ((event)=>{
                event.preventDefault()
                if(confirm(translate("confirm_delete_mesocycle"))){
                    deleteYourMesocycle(indexButtonCancel)
                }
            })
        }
    }
}

function deleteYourMesocycle(indexMesocycle){
    
    // Elimina un mesociclo del almacenamiento del usuario
    // - Actualiza IndexedDB
    // - Actualiza la lista de mesociclos en la interfaz

    yourMesocycles.splice(indexMesocycle,1)

    console.log("indexMesocycle",indexMesocycle)
    console.log("yourMesocycles",yourMesocycles)

    const request = openIndexedDB();

    request.onsuccess = function(event) {

        const db = event.target.result

        const transaction = db.transaction("yourMesocycles", "readwrite")
        const objectStore = transaction.objectStore("yourMesocycles")

        objectStore.put(yourMesocycles, "yourMesocycles")

        transaction.oncomplete = function() {
            console.log("Mesocycle removed successfully")
        }

        transaction.onerror = function(event) {
            console.error("Error removing mesocycle:", event.target.error)
        }

        updateYourMesocycles()
    }
}

function savePreset(){
    
    // Guarda un preset de mesociclo en localStorage
    // - Valida que todos los campos y ejercicios estén completos
    // - Sobrescribe un preset existente si el nombre coincide
    // - Habilita los botones de carga de preset

    const name = document.querySelector("#new_mesocycle_name").value.trim()
    const objective = document.querySelector("#new_mesocycle_objective").value
    const structure = document.querySelector("#new_mesocycle_structure").value
    const total_microcycle = document.querySelector("#new_mesocycle_total_microcycle").value
    const sessions_microcycle = document.querySelector("#new_mesocycle_sessions_microcycle").value
    const exercisesActive = containerNewMesocyclePage2.querySelectorAll(".exercise.active")

    if(!name || !objective || !structure || !total_microcycle || !sessions_microcycle || exercisesActive.length === 0){
        alert(translate("error_preset_options_required"))
        return
    }

    const exercises = reduceOptionExercises(getInputValues(containerNewMesocyclePage2,undefined,true))

    console.log({exercises})

    const preset = {
        name,
        objective,
        structure,
        total_microcycle,
        sessions_microcycle,
        exercises
    }

    const presets = localStorage.getItem("mesocyclePresets")?JSON.parse(localStorage.getItem("mesocyclePresets")):[]
    const existName = presets.find(preset=>preset.name.toLowerCase() === name.toLowerCase())

    if(existName){
        const confirmOverwrite = confirm(translate("confirm_overwrite_preset"))
        if(!confirmOverwrite)return

        const indexExistName = presets.findIndex(preset=>preset.name.toLowerCase() === name.toLowerCase())
        presets[indexExistName] = preset
    }else presets.push(preset)
    localStorage.setItem("mesocyclePresets",JSON.stringify(presets))

    buttonsLoadPresetNewMesocycle.forEach(button => button.removeAttribute("disabled"))

    alert(translate("alert_preset_saved_successfully"))

}

function loadPresets(){
    
    // Carga los presets de mesociclo desde localStorage y los muestra en un modal
    // - Configura botones de cargar y eliminar para cada preset
    
    const modalPresetsContent = document.getElementById("modal_presets_content")
    modalPresetsContent.innerHTML = ""

    const presets = localStorage.getItem("mesocyclePresets")?JSON.parse(localStorage.getItem("mesocyclePresets")):[]

    for(let indexPreset = 0 ; indexPreset < presets.length ; indexPreset++){
        const preset = presets[indexPreset]

        modalPresetsContent.insertAdjacentHTML(
            "beforeend",
            `<div class="preset" id_preset="${indexPreset}">
                <h2>${preset.name}</h2>
                <button class="accept" data-preset-index="${indexPreset}" translation="text|load">${translate("load")}</button>
                <button class="cancel" data-preset-index="${indexPreset}" translation="text|delete">${translate("delete")}</button>
            </div>`
        )
    }

    const buttonsAccept = modalPresetsContent.querySelectorAll(".preset .accept")
    const buttonsCancel = modalPresetsContent.querySelectorAll(".preset .cancel")

    for(let indexButtonAccept = 0 ; indexButtonAccept < buttonsAccept.length ; indexButtonAccept++){
        const buttonAccept = buttonsAccept[indexButtonAccept]
        buttonAccept.onclick = ((event)=>{
            event.preventDefault()
            const presetIndex = buttonAccept.getAttribute("data-preset-index")
            loadPreset(presetIndex)
        })
    }

    for(let indexButtonCancel = 0 ; indexButtonCancel < buttonsCancel.length ; indexButtonCancel++){
        const buttonCancel = buttonsCancel[indexButtonCancel]
        buttonCancel.onclick = ((event)=>{
            event.preventDefault()
            const presetIndex = buttonCancel.getAttribute("data-preset-index")
            deletePreset(presetIndex)
        })
    }
}

function loadPreset(presetIndex){
    
    // Carga un preset específico en el formulario de nuevo mesociclo
    // - Marca los ejercicios correspondientes como activos
    // - Actualiza botones de navegación y aceptar

    const presets = localStorage.getItem("mesocyclePresets")?JSON.parse(localStorage.getItem("mesocyclePresets")):[]
    const preset = presets[presetIndex]

    if(!preset){
        alert(translate("error_preset_not_found"))
        return
    }

    document.querySelector("#new_mesocycle_name").value = preset.name
    document.querySelector("#new_mesocycle_objective").value = preset.objective
    document.querySelector("#new_mesocycle_structure").value = preset.structure
    document.querySelector("#new_mesocycle_total_microcycle").value = preset.total_microcycle
    document.querySelector("#new_mesocycle_sessions_microcycle").value = preset.sessions_microcycle

    disableEnableNewMesocyclePage1Buttons()

    const elementExerciseList = containerNewMesocyclePage2.querySelector("#exercise_list")
    const elementsExercises = elementExerciseList.querySelectorAll(".exercise")
    const elementsInputs = elementExerciseList.querySelectorAll(".exercise input")
    const exercisesPreset = preset.exercises
    const exerciseNumbersPreset = Object.keys(exercisesPreset)

    console.log("preset",preset)
    console.log("elementsExercises",elementsExercises)

    for(let elementsInputsIndex = 0 ; elementsInputsIndex < elementsInputs.length ; elementsInputsIndex++){
        const elementInput = elementsInputs[elementsInputsIndex]
        if(elementInput.checked)elementInput.click()
    }

    for(let indexExercise = 0 ; indexExercise < elementsExercises.length ; indexExercise++){
        const elementExercice = elementsExercises[indexExercise]
        const id = elementExercice.querySelector("input").id.split("_")[1]
        const included = exerciseNumbersPreset.includes(id)

        console.log({id})

        if(included){
            const equipmentOptions = exercisesPreset[id].equipment
            const positionOptions = exercisesPreset[id].position
            const measurementOptions = exercisesPreset[id].measurement

            console.log("equipmentOptions",equipmentOptions)
            console.log("positionOptions",positionOptions)
            console.log("measurementOptions",measurementOptions)

            for(let indexEquipmentOption = 0 ; indexEquipmentOption < equipmentOptions.length ; indexEquipmentOption++){
                const equipmentOption = equipmentOptions[indexEquipmentOption]
                const inputEquipment = elementExercice.querySelector(`#exercise_${id}_equipment_${equipmentOption}`)
                if(inputEquipment && !inputEquipment.checked)inputEquipment.click()
            }
            for(let indexPositionOption = 0 ; indexPositionOption < positionOptions.length ; indexPositionOption++){
                const positionOption = positionOptions[indexPositionOption]
                const inputPosition = elementExercice.querySelector(`#exercise_${id}_position_${positionOption}`)
                if(inputPosition && !inputPosition.checked)inputPosition.click()
            }
            for(let indexMeasurementOption = 0 ; indexMeasurementOption < measurementOptions.length ; indexMeasurementOption++){
                const measurementOption = measurementOptions[indexMeasurementOption]
                const inputMeasurement = elementExercice.querySelector(`#exercise_${id}_measurement_${measurementOption}`)
                if(inputMeasurement && !inputMeasurement.checked)inputMeasurement.click()
            }
        }
    }

    disableEnableNewMesocyclePage2Buttons()

    closeModal("modal_presets")
}

function deletePreset(presetIndex){
    
    // Elimina un preset de mesociclo de localStorage
    // - Confirma con el usuario antes de eliminar
    // - Recarga la lista de presets

    const presets = localStorage.getItem("mesocyclePresets")?JSON.parse(localStorage.getItem("mesocyclePresets")):[]
    const preset = presets[presetIndex]

    if(!preset){
        alert(translate("error_preset_not_found"))
        return
    }

    const confirmDelete = confirm(translate("confirm_delete_preset"))
    if(!confirmDelete)return

    presets.splice(presetIndex,1)
    localStorage.setItem("mesocyclePresets",JSON.stringify(presets))

    loadPresets()
}

function openModal(idModal,autoRemoveTime){
    
    // Abre un modal específico
    // - Cierra cualquier modal abierto previamente
    // - Añade clase "open" al contenedor y "active" al modal
    // - Opcionalmente cierra el modal después de un tiempo

    if(!idModal)return
    closeModal()

    const modal = document.getElementById(idModal)

    if(modal){
        containerModals.classList.add("open")
        modal.classList.add("active")
    }

    if(autoRemoveTime){
        setTimeout(()=>{closeModal(idModal)},autoRemoveTime)
    }
}

function closeModal(idModal = containerModals.querySelector(".modal.active")?.id){
    
    // Cierra un modal específico
    // - Elimina la clase "open" del contenedor y "active" del modal
    
    const modal = document.getElementById(idModal)

    if(modal){
        containerModals.classList.remove("open")
        modal.classList.remove("active")
    }
}
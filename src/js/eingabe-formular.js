"use strict";

//Eingabe-Formular

const formular = {

    liste_monate: [],
    gesamt: new Gesamt_Bilanz(), 

    html_generieren:function(){

        let formular = document.querySelector("#eingabeformular-container");
        this.absenden_hinzugügen(formular);
    },

    //sortiert das array:liste_monate von GROß nach KLEIN
    array_sort: function(){

        this.liste_monate.sort((daten_a, daten_b) =>{return daten_b.getDatum().getMonth() - daten_a.getDatum().getMonth()
            // if (daten_a.getMonat() > daten_b.getMonat()){
            //     return -1;
            // } else if (daten_a.getMonat() < daten_b.getMonat()){
            //     return 1;
            // } else {
            //     return 0;
            // }
        });

        this.liste_monate.sort((daten_a, daten_b) =>{return daten_b.getDatum().getFullYear() - daten_a.getDatum().getFullYear()
            // if (daten_a.getJahr() > daten_b.getJahr()){
            //     return -1;
            // } else if (daten_a.getJahr() < daten_b.getJahr()){
            //     return 1;
            // } else {
            //     return 0;
            // }
        });
    },
    
    run:function(){
        this.wiederhestellen();
        this.array_sort();
        this.array_aktuallisieren();
        this.liste_monate.forEach((element)=>{element.eintrag_anzeigen();});
        this.gesamt_bilanz_anzeigen();
    },
    
    anzeigen: function(){
        this.run();
        this.html_generieren();
    },

    //holt die eingabe-daten aus Submit-Event
    eingabe_daten_holen:function(element){
        console.log(element);

        return {
            titel: element.target.elements.titel.value,
            einnahme: element.target.elements.einnahme.checked,
            ausgabe: element.target.elements.ausgabe.checked,
            betrag: element.target.elements.betrag.value,
            datum: element.target.elements.datum.valueAsDate,
        };
    },

    //gibt eingabe-daten von Benutzer zurück
    daten_verabeiten:function(daten){
        
        let typ;

        if (daten.einnahme == true){
            typ = "einnahme"
        } else if (daten.ausgabe == true){
            typ = "ausgabe"
        }

        return {
            titel: (daten.titel).trim(),
            typ: typ,
            betrag: parseFloat(daten.betrag)*100,
            datum: new Date(daten.datum),
        }
    },

    //entfernt ein Artikel
    entferne: function () {

        let entferne_list = document.querySelectorAll("article");
        
        if (entferne_list != null){
            entferne_list.forEach(element => element.remove());
        }
        
    },

    /**
     * 
     * @param {daten aus dem Submit-Event} eingabe_daten 
     * fügt dem jeweiligen Haushault-Array ein neue Benutzer-Eingabe ein
     */
    haushalt_eintrag:function(eingabe_daten){
        let gleich = false;
        
        for(let element in this.liste_monate){
            if (this.liste_monate[element].prüfe_monat_jahr(eingabe_daten.datum.getMonth(), eingabe_daten.datum.getFullYear())){
                this.liste_monate[element].benutzer_abfrage(eingabe_daten);
                gleich = true;
                break;
            }
        }

        if (gleich == false){
                this.liste_monate.push(new Haushalt(eingabe_daten.datum));
                this.liste_monate[this.liste_monate.length-1].benutzer_abfrage(eingabe_daten);
        }
    },

    //Überprüft ob liste_monate leer ist und fügt ein neues Haushalt ein
    amfang_eintrag: function(eingabe_daten){

        if (this.liste_monate.length == 0){
                
            this.liste_monate.push(new Haushalt(eingabe_daten.datum));
            this.liste_monate[0].benutzer_abfrage(eingabe_daten);

        } else if (this.liste_monate.length > 0){
            this.haushalt_eintrag(eingabe_daten);
        }
    },

    //Wenn Haushalt-Array leer ist wird das jeweilige Element aus dem Array entfernt
    array_aktuallisieren: function(){

        for(let element in this.liste_monate){
            if (this.liste_monate[element].getListe().length == 0){
                this.liste_monate.splice(element,1);
            }
        }
    },

    //Berechenet und gibt die Gesamt-Bilanz an
    gesamt_bilanz_anzeigen: function(){

        this.gesamt.reset();

        for(let i in this.liste_monate){
            for(let element of this.liste_monate[i].getListe()){
                this.gesamt.berechne_bilanz(element.type, element.betrag);
            }
        }

        this.gesamt.bilanz_anzeigen();
    },

    //Wenn ein neues Formular abgeschickt wird,
    //erstellt die Funktion einen neuen Haushalts-eintrag
    absenden_hinzugügen:function(formular){

        formular.querySelector("#eingabeformular").addEventListener("submit", (element) =>{
            element.preventDefault();
            let eingabe_daten = this.daten_verabeiten(this.eingabe_daten_holen(element));
            element.target.reset();

            this.amfang_eintrag(eingabe_daten);
            this.entferne();
            this.array_sort();
            this.array_aktuallisieren();
            this.liste_monate.forEach((element)=>{element.eintrag_anzeigen();});
            this.gesamt_bilanz_anzeigen();
        });
    },

    //speichert die alle Formular-daten in localStorage
    speichern: function(){
        localStorage.setItem("Eintrag", JSON.stringify(this.liste_monate));
    },

    /**
     * Die Funktion-wiederherszellen holt die Daten aus dem localStorage und
     * stellt aus älteren Session die Daten wieder her.
     * @param {Index von liste_monate} platz 
     * @param {JSON.parse Array-elemente} element 
     * @param {das eigentliste Haushalts-Klasse} liste 
     */

    haushalt_wiederherstellen(platz, element, liste){
        liste.forEach(list_eintrag => {
            this.liste_monate[platz].benutzer_abfrage({
                titel: list_eintrag.titel,
                typ: list_eintrag.type,
                betrag: list_eintrag.betrag,
                datum: new Date(element._datum),
            });
        });
    },

    //Daten werden aus dem localstorage geholt und die daten werden neu in liste eingetragen
    wiederhestellen:function(){
        let storage = localStorage.getItem("Eintrag");
        if (storage != null){
            let liste, platz = 0;
            JSON.parse(storage).forEach(element => {
                this.liste_monate.push(new Haushalt(new Date(element._datum)))
                liste = element._listen_eintrag

                this.haushalt_wiederherstellen(platz, element, liste);
                platz+=1;
            });
        }
    }
};
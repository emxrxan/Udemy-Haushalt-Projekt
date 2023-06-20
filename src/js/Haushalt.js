"use strict";

class Haushalt{
    
    constructor(datum){
        this._listen_eintrag = [];
        this._datum = datum;
    }

    getDatum = function(){
        return this._datum;
    }

    getListe = function(){
        return this._listen_eintrag;
    }

    /**
     * Prüft ob die Eingabe-Daten des Benutzers bereits existieren
     * @param {*} monat 
     * @param {*} jahr 
     * @returns true = für dein Monat und Jahr gibt es bereits einen Eintrag
     */
    prüfe_monat_jahr = function(monat, jahr){
        if (this._datum.getMonth() === monat && this._datum.getFullYear() === jahr){
            return true;
        } else {
            return false;
        }
    }

    //fügt dem Haushalt-Array neue Eingabe-Daten
    benutzer_abfrage= function (daten) {
        this._listen_eintrag.push(
            {
                titel: daten.titel,
                type: daten.typ,
                betrag: daten.betrag,
                datum: daten.datum,
                timestamps: Date.now(),
            },
        );

        this._array_sortieren();
        formular.speichern();
    }

    //sortier this._listen_eintrag von GROß nach KLEIN
    _array_sortieren = function () {
        this._listen_eintrag.sort((datum_a, datum_b) => {
            if (datum_a.datum > datum_b.datum) {
                return -1;
            } else if (datum_a.datum < datum_b.datum) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    //berechnet die jeweilige Bilanz für jeden Monat seperat
    _berchne_bilanz = function(){
        let bilanz = 0;

        this._listen_eintrag.forEach((element) =>{
            switch(element.type){
                case "einnahme":
                    bilanz += element.betrag; break;
                case "ausgabe":
                    bilanz -= element.betrag; break;
            }
        });

        return bilanz;
    }

    //zeigt die berechnete Bilanz des Monats an
    _monat_bilanz= function(){
        let monat_bilanz = document.createElement("span");

        if (this._berchne_bilanz() >= 0){
            monat_bilanz.setAttribute("class", "monatsbilanz positiv");
        } else {
            monat_bilanz.setAttribute("class", "monatsbilanz negativ");
        }
        monat_bilanz.insertAdjacentText(
            "afterbegin", `${(parseFloat(this._berchne_bilanz())/100).toFixed(2).replace(".", ",")}€`
        );

        return monat_bilanz;
    }

    //zeigt welcher MONAT und JAHR an
    _kalenderausgabe = function(){

        let h2 = document.createElement("h2");

        let monat_jahr = document.createElement("span");
        monat_jahr.setAttribute("class", "monat-jahr");
        let m_j = this._datum.toLocaleDateString("de-DE",{
            month: "long",
            year: "numeric",
        });
        monat_jahr.insertAdjacentText("afterbegin", `${m_j}`);
        h2.appendChild(monat_jahr);
        h2.appendChild(this._monat_bilanz());

        return h2;
    }
    
    //Haushalt wird als HTML generiert und in die index.html hinzugefügt
    eintrag_anzeigen = function () {

        let article = document.createElement("article");
        article.setAttribute("class", "monatsliste");

        article.insertAdjacentElement("afterbegin", this._kalenderausgabe());

        let eintrag = document.createElement("ul");
        this._listen_eintrag.forEach((liste) => {
            eintrag.insertAdjacentElement("beforeend", this._li_eintrag(liste));
        });

        article.insertAdjacentElement("beforeend", eintrag);

        let einfügen = document.querySelector("#monatslisten");
        einfügen.insertAdjacentElement("beforeend", article);

        this.eintrag_entfernen(article);
    }

    _li_eintrag=function (liste) {

        let li = document.createElement("li");
        let datum = document.createElement("span");
        datum.setAttribute("class", "datum");
        let titel = document.createElement("span");
        titel.setAttribute("class", "titel")
        let betrag = document.createElement("span");
        betrag.setAttribute("class", "betrag")
        let entferne = document.createElement("button");
        entferne.setAttribute("class", "entfernen-button");
        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-trash");
        entferne.appendChild(icon);

        return this._li_eintrag_erweiterung(li, liste, datum, titel, betrag, entferne);
    }

    /**
     * 
     * @param {listen-html-tag} li 
     * @param {Haushault-Eintrag} liste 
     * @param {span-html-tag} datum 
     * @param {span-html-tag} titel 
     * @param {span-html-tag} betrag 
     * @param {button} entferne 
     * @returns gibt das generierte li-tag zurrück
     */
    _li_eintrag_erweiterung= function (li, liste, datum, titel, betrag, entferne) {
        switch (liste.type) {
            case "einnahme":
                li.setAttribute("class", "einnahme");
                break;
            case "ausgabe":
                li.setAttribute("class", "ausgabe");
                break;
        }

        datum.insertAdjacentText("afterbegin", liste.datum.toLocaleDateString("de-DE", {
            day: "2-digit", //zwei stellig
            month: "2-digit",
            year: "numeric",
        }));
        li.appendChild(datum);
        li.setAttribute("data-timestamp", liste.timestamps);
        titel.insertAdjacentText("afterbegin", liste.titel);
        li.appendChild(titel);
        betrag.insertAdjacentText("afterbegin", `${(liste.betrag / 100).toFixed(2).replace(".", ",")}€`);
        li.appendChild(betrag);
        li.appendChild(entferne);

        return li;
    }

    /**
     * entfernt li-Tag aus dem Haushalt
     * @param {Date.now} timestamp 
     * @param {article-html-tag} article 
     */
    _array_aktuallisieren = function(timestamp, article){
        for (let i = 0; i<this._listen_eintrag.length; i++){
            if(this._listen_eintrag[i].timestamps == timestamp){
                this._listen_eintrag.splice(i,1);
                article.querySelector("h2").remove();
                article.insertAdjacentElement("afterbegin", this._kalenderausgabe());
            }
        }
    }

    /**
     * entfernt ein listen-element wenn das Mülltonnen button Symobl gedrückt wird
     * danach wird nochmal alles im formular aktuallisiert
     * @param {article-html-tag} article 
     */
    eintrag_entfernen= function(article){
        let li_element = article.querySelectorAll("li");
        let timestamp;
        li_element.forEach((element)=>{
            element.querySelector(".entfernen-button").addEventListener("click",button=>{
                timestamp = button.target.parentElement.getAttribute("data-timestamp");
                if (timestamp == element.getAttribute("data-timestamp")){
                    element.remove();
                    this._array_aktuallisieren(timestamp, article);
                    formular.array_aktuallisieren();
                    formular.entferne();
                    formular.liste_monate.forEach((element)=>{element.eintrag_anzeigen();});
                    formular.gesamt_bilanz_anzeigen();
                    formular.speichern();
                }
            });
        });
    }
}
"use strict";

class Gesamt_Bilanz{

    constructor(){
        this._gesamt = 0;
        this._einnahme = 0;
        this._ausgaben = 0;
    }

    //setzt eigenschaft auf 0
    reset = function(){
        this._gesamt = 0;
        this._einnahme = 0;
        this._ausgaben = 0;
    }

    //berechnet die Gesamt-Bilanz
    berechne_bilanz = function(type, betrag){
        switch(type){
            case "einnahme":
                this._einnahme += betrag;
                this._gesamt += betrag;
                break;
            case "ausgabe":
                this._ausgaben += betrag;
                this._gesamt -= betrag;
                break;
        }
    }
    
    //erstellt ein Einnahme-Tag in der gesamt-bilanz 
    _einnahme_generieren(){
        let div = document.createElement("div");
        div.setAttribute("class","gesamtbilanz-zeile einnahmen");

        let span_inhalt = document.createElement("span");
        span_inhalt.insertAdjacentText("afterbegin", "Einnahmen:");
        div.appendChild(span_inhalt);

        let betrag = document.createElement("span");
        betrag.insertAdjacentText("afterbegin", `${(parseFloat(this._einnahme)/100).toFixed(2).replace(".", ",")}€`);
        div.appendChild(betrag);

        return div;

    }

    //erstellt Ausgabe-Tag in der gesamt-bilanz 
    _ausgabe_generieren(){
        let div = document.createElement("div");
        div.setAttribute("class","gesamtbilanz-zeile ausgaben");

        let span_inhalt = document.createElement("span");
        span_inhalt.insertAdjacentText("afterbegin", "Ausgaben:");
        div.appendChild(span_inhalt);

        let betrag = document.createElement("span");
        betrag.insertAdjacentText("afterbegin", `${(parseFloat(this._ausgaben)/100).toFixed(2).replace(".", ",")}€`);
        div.appendChild(betrag);

        return div;
    }

    //erstellt Gesamt-Bilanz-Tag in der gesamt-bilanz 
    _gesamt_generieren(){
        let div = document.createElement("div");
        div.setAttribute("class","gesamtbilanz-zeile bilanz");

        let span_inhalt = document.createElement("span");
        span_inhalt.insertAdjacentText("afterbegin", "Bilanz:");
        div.appendChild(span_inhalt);

        let betrag = document.createElement("span");
        if (this._gesamt >= 0){
            betrag.setAttribute("class", "positiv");
        } else {
            betrag.setAttribute("class", "negativ");
        }

        betrag.insertAdjacentText("afterbegin", `${(parseFloat(this._gesamt)/100).toFixed(2).replace(".", ",")}€`);
        div.appendChild(betrag);

        return div;
    }

    //erstellt die gesammte Geamt-Bilanz
    _html_generieren= function(){
        let aside = document.createElement("aside");
        aside.setAttribute("id", "gesamtbilanz");

        let h1 = document.createElement("h1");
        h1.insertAdjacentText("afterbegin","Gesamtbilanz");
        aside.appendChild(h1);

        let einahme = this._einnahme_generieren();
        let ausgabe = this._ausgabe_generieren();
        let gesamt = this._gesamt_generieren();

        aside.appendChild(einahme);
        aside.appendChild(ausgabe);
        aside.appendChild(gesamt);

        return aside;
    }

    //zeigt die Gesamt-Bilanz auf der Website an
    bilanz_anzeigen= function(){
        document.querySelector("#gesamtbilanz").remove();
        let aside = this._html_generieren();

        document.querySelector("#monatslisten").insertAdjacentElement("afterend", aside);
    }
}
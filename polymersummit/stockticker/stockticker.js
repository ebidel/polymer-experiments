// Raw ES6 class w/ Custom ELements
//
// Features
// 1. Classes!
// 2. custom element lifecycle callbacks
// 3. shadow dom - created in the former
// 4. template strings (single and multiline)
// 5. let - logical scoping
// 6. for of loop
// 7. fetch() API
// 8. arrow functions
// 9. Custom elements document.register() - passed a class

'use strict';

class StockTicker extends HTMLElement {

  static get is() {
    return 'stock-ticker-raw';
  }

  createdCallback() {
    this.createShadowRoot().innerHTML = `
      <style>
        :host {
          display: block;
        }
        h1, h3 {
          margin: 0;
          font-weight: 400;
        }
        h1 {
          margin-right: 12px;
        }
        header {
          display: flex;
          align-items: center;
        }
        footer {
          margin-top: 10px;
          margin-bottom: 24px;
          font-size: 12px;
        }
        a {
          text-decoration: none;
          color: currentColor;
        }
      </style>
     <div id="quotes"><div>
    `;
    this.updateQuotes();
  }

  get symbols() {
    let s = this.getAttribute('symbols');
    return s ? JSON.parse(s) : [];
  }

  set symbols(val) {
    this.setAttribute('symbols', JSON.stringify(val));
    this.updateQuotes();
  }

  updateQuotes() {
    if (!this.symbols.length) {
      return;
    }

    let url = `https://finance.google.com/finance/info?client=ig&q=${this.symbols}`;
    url = `http://crossorigin.me/${url}`;

    return fetch(url).then(resp => resp.text()).then(text => {
      let parsedText = text.slice(text.indexOf('['));
      let tickers = JSON.parse(parsedText);

      let html = '';
      for (let t of tickers) {
        // Skip unknown symbols.
        if (!t.t) {
          continue;
        }

        let gain = t.c >= 0;
        let arrow = gain ? '&#9650;' : '&#9660;';
        let color = gain ? '#4CAF50' : '#F44336';

        html += `
          <header>
            <h1>${t.t} - ${t.l}</h1>
            <h3 style="color:${color}">
              ${arrow} ${t.c.slice(1)} (${Math.abs(t.cp)}%)
            </h3>
          </header>
        `;

        if (t.ec) {
          let gain = t.ec >= 0;
          let arrow = gain ? '&#9650;' : '&#9660;';
          let color = gain ? '#4CAF50' : '#F44336';

          html += `
            <div>
              <span>After-hours: ${t.el}</span>
              <span style="color:${color}">
                ${arrow} ${t.ec.slice(1)} (${Math.abs(t.ecp)}%)
              </span>
            </div>
          `;
        }

        html += `
          <footer>${t.e} - data provided by
            <a href="https://www.google.com/finance?q=${t.t}" target="_blank">Google Finance</a>
          </footer>
        `;
      }

      this.shadowRoot.lastElementChild.innerHTML = html;

      return tickers;
    });
  }
}

document.registerElement(StockTicker.is, StockTicker);

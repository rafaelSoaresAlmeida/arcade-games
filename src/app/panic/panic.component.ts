import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panic',
  template: `
    <div class="wiki-page" (click)="goHome()">
      <div class="wiki-header">
        <div class="wiki-logo">WIKIPEDIA</div>
        <div class="wiki-subtitle">The Free Encyclopedia</div>
      </div>

      <div class="wiki-article">
        <h1>Prote&ccedil;&atilde;o de dados</h1>

        <div class="wiki-meta">
          Origem: Wikip&eacute;dia, a enciclop&eacute;dia livre.
        </div>

        <div class="wiki-content">
          <p>
            <b>Prote&ccedil;&atilde;o de dados</b> &eacute; o conjunto de medidas t&eacute;cnicas
            e organizacionais destinadas a proteger informa&ccedil;&otilde;es pessoais contra
            acessos n&atilde;o autorizados, perda, altera&ccedil;&atilde;o indevida ou divulga&ccedil;&atilde;o
            sem consentimento. &Eacute; um tema central na era digital, regulamentado por leis como a
            <b>LGPD</b> (Lei Geral de Prote&ccedil;&atilde;o de Dados Pessoais) no Brasil e o
            <b>GDPR</b> (General Data Protection Regulation) na Uni&atilde;o Europeia.
          </p>

          <h2>Hist&oacute;rico</h2>
          <p>
            A necessidade de proteger dados pessoais surgiu com o avan&ccedil;o da inform&aacute;tica
            e da internet. Na d&eacute;cada de 1970, pa&iacute;ses europeus come&ccedil;aram a criar
            legisla&ccedil;&otilde;es espec&iacute;ficas sobre o tratamento de dados pessoais.
            Em 2018, o Brasil promulgou a Lei n&ordm; 13.709/2018 (LGPD), inspirada no GDPR europeu.
          </p>

          <h2>Princ&iacute;pios fundamentais</h2>
          <ul>
            <li><b>Finalidade:</b> os dados devem ser coletados para prop&oacute;sitos leg&iacute;timos e espec&iacute;ficos.</li>
            <li><b>Adequa&ccedil;&atilde;o:</b> compatibilidade do tratamento com as finalidades informadas.</li>
            <li><b>Necessidade:</b> limita&ccedil;&atilde;o do tratamento ao m&iacute;nimo necess&aacute;rio.</li>
            <li><b>Transpar&ecirc;ncia:</b> informa&ccedil;&otilde;es claras e acess&iacute;veis sobre o tratamento.</li>
            <li><b>Seguran&ccedil;a:</b> medidas t&eacute;cnicas para proteger os dados contra acessos indevidos.</li>
            <li><b>Preven&ccedil;&atilde;o:</b> ado&ccedil;&atilde;o de medidas para prevenir a ocorr&ecirc;ncia de danos.</li>
          </ul>

          <h2>Direitos do titular</h2>
          <p>
            O titular dos dados possui direitos como: acesso aos dados, corre&ccedil;&atilde;o,
            elimina&ccedil;&atilde;o, portabilidade, revoga&ccedil;&atilde;o de consentimento e
            informa&ccedil;&atilde;o sobre o compartilhamento com terceiros.
          </p>

          <h2>LGPD no Brasil</h2>
          <p>
            A Lei Geral de Prote&ccedil;&atilde;o de Dados Pessoais (LGPD) entrou em vigor em setembro
            de 2020. Ela estabelece regras para a coleta, tratamento e armazenamento de dados pessoais
            por empresas e &oacute;rg&atilde;os p&uacute;blicos. A fiscaliza&ccedil;&atilde;o &eacute;
            realizada pela <b>ANPD</b> (Autoridade Nacional de Prote&ccedil;&atilde;o de Dados).
          </p>

          <h2>Ver tamb&eacute;m</h2>
          <ul>
            <li>Privacidade digital</li>
            <li>Criptografia</li>
            <li>Seguran&ccedil;a da informa&ccedil;&atilde;o</li>
            <li>Cybersecurity</li>
          </ul>

          <div class="wiki-click-hint">
            Clique em qualquer lugar para voltar
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wiki-page {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #ffffff;
      font-family: Georgia, 'Times New Roman', serif;
      overflow-y: auto;
      cursor: pointer;
      z-index: 99999;
      color: #202122;
      font-size: 14px;
      line-height: 1.6;
    }
    .wiki-header {
      background: #ffffff;
      border-bottom: 1px solid #a2a9b1;
      padding: 12px 24px;
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .wiki-logo {
      font-size: 24px;
      font-weight: bold;
      color: #000;
    }
    .wiki-subtitle {
      font-size: 12px;
      color: #54595d;
    }
    .wiki-article {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }
    .wiki-article h1 {
      font-size: 32px;
      font-family: 'Linux Libertine', Georgia, serif;
      border-bottom: 1px solid #a2a9b1;
      padding-bottom: 6px;
      margin-bottom: 12px;
      color: #000;
    }
    .wiki-article h2 {
      font-size: 22px;
      font-family: 'Linux Libertine', Georgia, serif;
      border-bottom: 1px solid #a2a9b1;
      padding-bottom: 4px;
      margin-top: 24px;
      color: #000;
    }
    .wiki-meta {
      font-size: 12px;
      color: #54595d;
      margin-bottom: 20px;
    }
    .wiki-content p {
      margin-bottom: 14px;
    }
    .wiki-content ul {
      margin-bottom: 14px;
      padding-left: 28px;
      list-style: disc;
    }
    .wiki-content li {
      margin-bottom: 6px;
    }
    .wiki-click-hint {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 40px;
      padding: 16px;
      border: 1px dashed #ccc;
    }
    b {
      font-weight: bold;
    }
  `],
})
export class PanicComponent {
  constructor(private router: Router) {}

  @HostListener('click')
  goHome() {
    this.router.navigate(['/']);
  }
}

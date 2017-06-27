import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers} from '@angular/http';
import { Directive, forwardRef } from '@angular/core';
import { ValidationErrors, AbstractControl } from '@angular/forms';


import 'rxjs/add/operator/map';
//import { DomSanitizer } from '@angular/plataform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
//import { Contato } from './contato';
//import { EmailValidator } from '../emailvalidator';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})

export class ContatoComponent implements OnInit {
  falha = {sucesso: false, texto: "Problemas no envio do formulário de contato!"} 
  contatoForm: FormGroup;
  listaErros = [];
  listaResultado = [];
  
  constructor(private fb: FormBuilder, private http: Http, private zone: NgZone) { }

  mensagensErro = { 'nome': {'required': 'Favor preencher o nome'},
                    'email': { 'required': 'Favor preencher o email',
                               'emailIsValid': 'O formado do email preenchido está incorreto'},
                    'texto': { 'required': 'Favor preencher o texto',
                               'minLenght': 'Você precisa informar um texto com no mínimo 5 caracteres',
                               'maxLength': 'O limite do texo é de 100 caracteres'}
  };

  ngOnInit() {
     this.buildForm();
  }

  buildForm(){
    this.contatoForm = this.fb.group({
      'nome': ['', [Validators.required]],
      'email': ['', [Validators.required, EmailValidator.emailIsValid]],
      'texto': ['', [Validators.required, Validators.minLength(4),
                        Validators.maxLength(100)]]
    })

    this.contatoForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
    
    onSubmit() {
      if (this.contatoForm.valid) {
        let headers = new Headers(
          { 'Content-Type': 'application/json' });
          let options = new RequestOptions( {headers : headers } );
          this.http.post('api/contato',
             JSON.stringify(this.contatoForm.value), options)
             .map(this.mapeiaResultado)
             .subscribe(recent => {
               this.zone.run(() => {
                 this.resultadoEnviocontato(recent);
               });
             });
      }
    }

    mapeiaResultado(res: Response) { 
      return res.json(); 
    }

    resultadoEnviocontato(res: Resultado | any) {
      var sucesso = {sucesso: true,
        texto: "Contato enviado com sucesso!"};
      this.listaResultado = [];
      if (res.success) {
        this.listaResultado.push(sucesso);
        this.contatoForm.markAsPristine();
        this.contatoForm.reset();
      } else {
        this.listaResultado.push(this.falha);
      }
    }

  onValueChanged(data?: any) {
    if (!this.contatoForm) return;
    
    this.listaErros = [];
    
    for(const field in this.contatoForm.controls) {
      var control = this.contatoForm.get(field);
      if (control && control.dirty && !control.valid) {
        for (const error in control.errors) {
          this.listaErros.push({sucesso: false,
            texto: this.mensagensErro[field][error]});
        }
      }
    }
  }

}

export class Resultado{
  success: false
}

export class EmailValidator {
static emailIsValid(control: AbstractControl): ValidationErrors|null {
  let EMAIL_REGEXP = 
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  return EMAIL_REGEXP.test(control.value) ? null : {
  emailIsValid: {
    valid: false
  }
 };
}
}

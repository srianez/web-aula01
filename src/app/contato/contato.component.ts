import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})

export class ContatoComponent implements OnInit {
  contatoForm: FormGroup;

  constructor(private fb: FormBuilder) { }

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
      'email': ['', [Validators.required]],
      'texto': ['', [Validators.required, Validators.minLength(4),
                        Validators.maxLength(100)]]
    })
  }

  onSubmit() {}
}

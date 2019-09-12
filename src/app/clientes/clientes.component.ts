import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginator: any; //Need to track the page on the list

  constructor(private clienteService: ClienteService,
        private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginator = response;
        }
      )
    });
  }

  
  public delete(cliente: Cliente): void {
/*
    Swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
  Swal({
    title: "Are you sure?",
    text: "Are you sure that you want to leave this page?",
    icon: "warning",
    dangerMode: true,
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: false,
    html: false
    //confirmCancelButtonColor: '#3085d6',
    cancelButtonColor: '#d13',
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger',
    buttonsStyling:false
  }).then(

  );
  */
  if(confirm("Esta seguro?"))
    this.clienteService.delete(cliente.id).subscribe(
      response => {
        //HAy que actualizar el listado
        this.clientes = this.clientes.filter(cli => cli.id !== cliente.id);
        swal.fire('Client deleted!', `Client ${cliente.name} has been deleted`, 'success');
      }
    );
  }

}

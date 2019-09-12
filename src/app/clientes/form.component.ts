import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router, ActivatedRoute} from '@angular/router'
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private client: Cliente = new Cliente();
  private title: string = 'Create Cliente';
  private errors : string[];

  constructor(private clientService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //Essential in order to show client data once we accesed through /clients/form/:id
    this.loadClient();
  }

  public create(): void{
    console.log(`About to save ${this.client}`);
    this.clientService.createClient(this.client)
    //For an unknown reason, client is null so I rely on this.client.
    //[SOLVED] In the service we had (response:any) => response.client(e) as Cliente and not response.client
      .subscribe(
        client => { 
            this.router.navigate(['/clients']);
            swal.fire('New client', `Client ${client.name} successfully registered`, 'success');
        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(this.errors);
        }
    );
  }

  public loadClient(): void{
    //This is not enough
    //this.clientService.getCliente(id).subscribe(cliente=>this.router.navigate(['/']))
    //The activatedRoute will handle routes with path params from the router-outlet
    this.activatedRoute.params.subscribe(params=>{
      let id= params['id'];
      if(id){
        this.clientService.getCliente(id).subscribe(cliente=>this.client=cliente);
      }
    });
  }

  public update(): void{
    this.clientService.update(this.client)
      .subscribe(
        client =>
        {
            this.router.navigate(['/clients']);
            swal.fire('Update client', `Client ${client.name} successfully updated`, 'success');
        }, 
        err => {
            this.errors = err.error.errors as string[];
            console.error('Código del error desde el backend: ' + err.status);
            console.error(this.errors);
        }
    );
  }

}

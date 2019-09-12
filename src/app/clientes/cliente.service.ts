import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { formatDate, DatePipe } from '@angular/common'
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import {applicationJsonHeader} from '../constants';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable()
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clients/';
  private httpHeaders: HttpHeaders = new HttpHeaders(applicationJsonHeader);
  constructor(private http: HttpClient, private router: Router) { }
  /*
          As we've made client results pageable the json returned from 
          Spring data bakend will return the client data in the content property.
          For instance:
          {
          "content": [
              {
                  "id": 11,
                  "name": "Klim",
                  "surname": "Obenhorff",
                  "email": "klim.obenhrf399@hotmail.com",
                  "createdAt": "2019-04-01",
                  "birthdate": "1987-03-30"
              },[...]
            ],
            "pageable": {
              "sort": {
                  "sorted": false,
                  "unsorted": true,
                  "empty": true
              },
              "pageSize": 5,
              "pageNumber": 2,
              "offset": 10,
              "paged": true,
              "unpaged": false
          },
          "totalPages": 3,
            [...]
  */
  getClientes(page?:number): Observable<any> {
    if(page == null){
      page = 0;
    }
    //return of(CLIENTES);
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      tap((response:any) =>{
        console.log('getClientes() - tap');
        (response.content as Cliente[]).forEach(client => {
          console.log(client.name);
        });
      }),
      map((response: any) => {
        let clients = response.content as Cliente[];
        clients.map(c=> {
          c.name = c.name.toUpperCase();
          //Other ways to format dates aside from pipes as birthday does.
          //With formatDate approach
          //c.createdAt = formatDate(c.createdAt, 'dd/MM/yyyy', 'es');
          //Or by using DatePipe programatically
          let datePipe = new DatePipe('es');
          c.createdAt = datePipe.transform(c.createdAt, 'EEEE dd, MMMM yyyy');
          /* Taking into account that we will do the same thing in every 
          * 'getter' service for transforming dates we will bump into boilerplate code.
          *  The ideal approach is by using angular locale configuration in the app-module
          *  so that we do not have to repeat code everywhere
          *  registerLocaleData(localeES, 'es');
          */
          //Be careful with closures!!
          //return response;
        });
        //The right place ;-)
        return response;
      })
    );
  }

  getCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
    .pipe(
      catchError(err => {
        //Si ha habido error que se muestre un dialogo de aviso y además redireccionar al listado de clientes
        this.router.navigate(['/clients']);
        console.error(err.error.message);
        swal.fire('Error al consultar el cliente', err.error.error, 'error');
        //devolver el error envuelto en un observable. catchError espera que se devuelva tal tipo de datos
        return throwError(err);
      })
    );
  }

  createClient(client: Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndPoint, client, {headers : this.httpHeaders}).pipe(
      /*
        Watch out! make sure you correctly point the property of the response. Before, it was response.cliente, 
        so the subscribe in form.create couldn't appropiately retrieve the client
      */
      map( (response:any) => response.client as Cliente), 
      catchError(e =>{
        /*
          If response status is 400 from Backend, throw error so that 
          the form component will handle such error
        */
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.message);
        swal.fire('Unable to create client', e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente:Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(
      `${this.urlEndPoint}/${cliente.id}`, 
      cliente, //El cliente con los nuevos datos para ser actualizados por el back
      {headers : this.httpHeaders}).pipe(
        map( (response:any) => response.client as Cliente),
        catchError(e =>{
          if(e.status == 400){
            return throwError(e);
          }
          console.error(e.error.message);
          swal.fire('Unable to update client', e.error.error, 'error');
          return throwError(e);
        })
      );;
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers : this.httpHeaders});
  }

}

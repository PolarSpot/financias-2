import fs from "node:fs/promises"

const databasePath = new URL('../db.json', import.meta.url)

interface IDatabase {
  id: string
  name: string
  endereco: string
  cep: string
  cpf: number
  saldo: number
  operacao: [{
    tipo: string
    valor: number
  }]
}

export class Database {
  #database: IDatabase[][] = [];

  constructor(){
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data);
      }).catch(() => {
        this.#persist();
      });
  }

  //Envia as informações para o banco de dados (db.json)
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  //seleciona os dados dentro do banco
  select(table: any, id?: string):IDatabase[] {
    let data = this.#database[table] ?? []
    //"??" Verifica se a condição anterior a ele é "null" ou "undefined", se for o caso, realiza o comando posterior a ele

    if (id) {
      data = data.find((row: any) => {
        return row.id === id;
      });
    }

    return data
  }

  //Insere dados dentro do banco
  insert(table: any, data: IDatabase): IDatabase {
    if (Array.isArray(this.#database[table])){
      // Se sim, entra aqui
      this.#database[table].push(data);
      this.#persist();
    } else {
      // Se não, entra aqui
      this.#database[table] = [data]
    }

    return data
  }

  //deleta dados dentro do banco
  delete(table:any, id:string): void{
    const rowIndex = this.#database[table].findIndex(
      (row:any) => row.id === id);

    if(rowIndex > -1){
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  //atualiza dados dentro do banco
  update(table: any, id: string, data: IDatabase): void {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = data;
      this.#persist();
    }
  }


}

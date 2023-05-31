import { Router } from "express";
import { randomUUID } from "node:crypto";
import { Database } from "../database";

const userRoute = Router();

const database = new Database();

//Nomeia a tabela como "user"
const table = "user";

// request = parametro que esta vindo do CLIENTE
// response = parametro que esta vindo do CLIENTE

//VISUALIZAR BANCO DE DADOS
//userRoute.método("rota", (parâmetro 1, parâmetro 2) => {Resultado})
userRoute.get("/", (request, response) => {
  const user = database.select(table);
  response.json(user);
});

//VISUALIZAR USUÁRIO ESPECÍFICO
userRoute.get("/:id", (request, response) => {
  const { id } = request.params;

  const result = database.select(table, id);

  // console.log(result, " - ", typeof result);

  if (result === undefined)
    response
            .status(400)
            .json({ msg: "Usuário não encontrado!" });

  response.json(result);
});

// Parâmetro que esta vindo do CLIENTE - REQUEST
// Parâmetro que esta indo para o CLIENTE - RESPONSE

//CRIAR USUÁRIO
userRoute.post("/", (request, response) => {
  const { name, avatar, celular } = request.body;

  //determina as propriedades
  const user = {
    id: randomUUID(),
    name,
    avatar,
    celular
  };

  //database.insert('onde será inserido', 'o que será inserido')
  database.insert(table, user);

  response
          .status(201)
          .json({ msg: "sucesso!" });
});

//DELETAR
userRoute.delete("/:id", (request, response) => {
  const { id } = request.params;

  const userExist: any = database.select(table, id);

  // console.log(result, " - ", typeof result);

  // caso o usuário não existir
  if (userExist === undefined)
    return response.status(400).json({ msg: "Usuário não encontrado!" });

  database.delete(table, id);

  response
          .status(202)
          .json({ msg: `Usuário ${userExist.name} foi deletado do banco` });
});

//EDITAR
userRoute.put("/:id", (request, response) => {
  const { id } = request.params;
  const { name, avatar, celular } = request.body;

  const userExist: any = database.select(table, id);

  // caso o usuário não existir
  if (userExist === undefined)
    return response.status(400).json({ msg: "Usuário não encontrado!" });

  database.update(table, id, { id, name, avatar, celular });

  response.status(201).json({ msg: `O ID: {${id}} foi alterado banco` });
});

<<<<<<< HEAD
=======
//SALDO DA CONTA
userRoute.get("/saldo/:id", (request, response) => {
  const { id } = request.params;

  const userExist: any = database.select(table, id);

  if (userExist === undefined)
    return response.status(400).json({ msg: "Usuário não encontrado!" });

  response
  .status(201)
  .json({ msg: `Saldo de ${userExist.name}: ${userExist.saldo}` })
});

//DEPOSITAR (ajuda do Juan por call do Discord)
userRoute.put('/deposito/:id', (request,response)=>{

  const { id } = request.params;
  const {tipo, valor} = request.body;
  const userExist:any = database.select(table, id);
  let transacao = userExist.transacao;
  let saldo = userExist.saldo;

  if(userExist === undefined)
    return response
                    .status(400)
                    .json({msg:'Erro! Esse usuário não foi encontrado no sistema.'});

  transacao.push({tipo, valor});

  database.update(table, id, {id, saldo: saldo + Number(valor), transacao});

  response
          .status(201)
          .json({msg: `Sucesso! Foi depositado o valor de R$${valor}`});

});

//SAQUE (ajuda do Juan por call do Discord)
userRoute.put('/saque/:id', (request,response)=>{
  
  const { id } = request.params;
  const {tipo, valor} = request.body;
  const userExist:any = database.select(table, id);
  let transacao = userExist.transacao;
  let saldo = userExist.saldo;
  
  if(userExist === undefined)
    return response
                    .status(400)
                    .json({msg:'Erro! Esse usuário não foi encontrado no sistema.'});

  if(userExist.saldo >= Number(valor)) {

    transacao.push({tipo, valor});

    database.update(table, id, {id, saldo: saldo - Number(valor), transacao});

    response
            .status(201)
            .json({msg: `Sucesso! Foi retirado o valor de R$${valor}`});

    } else {
      response
              .status(404)
              .json({msg: `Erro! Você não possuí dinheiro o suficiente para realizar esta transação`});

    }
    
});


>>>>>>> 3ca5eca9b1eb7204524a34083dab0cd7f08c58d3
export { userRoute };

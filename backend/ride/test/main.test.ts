import { getAccount, requestRide, signup } from "../src/main";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve criar uma conta para o passageiro", async function (cpf: string) {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf,
		isPassenger: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup(inputSignup);
	const outputGetAccount = await getAccount(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta se o nome for inválido", async function () {
	// given
	const inputSignup = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta se o email for inválido", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid email"));
});

test.each([
	"",
	undefined,
	null,
	"11111111111",
	"111",
	"11111111111111"
])("Não deve criar uma conta se o cpf for inválido", async function (cpf: any) {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf,
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta se o email for duplicado", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await signup(inputSignup);
	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
});

test("Deve criar uma conta para o motorista", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup(inputSignup);
	const outputGetAccount = await getAccount(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
});

test.each([
  '5a6f38e1-3f63-4846-b4b9-3382941b0825',
  '691c3a25-b47f-4468-80b7-8a8d439d008e'
])("Usuário inválido não pode solicitar corrida", async function (account_id: string) {
  const inputUser = {
    account_id,
    from:{'lat':-23.563099,'lng':-46.656571},
    to:{'lat':-23.561805,'lng':-46.655035}
  }
  await expect(() => requestRide(inputUser)).rejects.toThrow(new Error("Invalid user"));
});

test("Usuário válido pode solicitar uma corrida", async function(){
  const inputUser = {
    account_id: '531e3ea9-a862-434d-8398-ad50de20c23b',
    from:{'lat':-23.563099,'lng':-46.656571},
    to:{'lat':-23.561805,'lng':-46.655035}
  }

  const ride =  await requestRide(inputUser)
  expect(ride).toBeDefined();
})

test("Não deve permitir solicitar uma nova corrida caso haja uma não finallizada", async function(){
  const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf:'87748248800',
		isPassenger: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup(inputSignup);
  const inputUser = {
    account_id: outputSignup.accountId,
    from:{'lat':-23.563099,'lng':-46.656571},
    to:{'lat':-23.561805,'lng':-46.655035}
  }
  const ride =  await requestRide(inputUser)

  await expect(() => requestRide(inputUser)).rejects.toThrow(new Error("Já existe uma corrida não finalizada"));
})

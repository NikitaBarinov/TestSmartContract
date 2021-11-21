const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ('Token contract',  () => {
    let Token, token, owner, addr1, addr2;

    beforeEach(async () => {
        Token = await ethers.getContractFactory('Token');
        [owner, addr1, addr2, _] = await ethers.getSigners();
        token = await Token.deploy();
    });

    describe('Deployment', () => {
        it('Should set right owner', async () => {
            expect(await token.owner()).to.equal(owner.address);
        });
    });

    describe('Transactions', () => {
        //test donat function
        it('Should donate tokens on contract', async () =>{
            await token.connect(addr1).donate({from: addr1.address, value: ethers.utils.parseEther("20") }); //Переводим пожертвование: 20 ether

            const token1Balance = await token.getbalanceOf(token.address);// баланс аккаунта токена 

            expect(token1Balance.balance).to.equal("20000000000000000000");//Сумма переводится в ether, а сравнивается в wei
        });

        it('Should update balances after donat', async () => {
            const initialtokenBalance = await token.getbalanceOf(token.address);//Получаем начальные балансы контракта и кошелька
            const initialaddr1Balance = await token.getbalanceOf(addr1.address);

            await token.connect(addr1).donate({from: addr1.address, value: ethers.utils.parseEther("20") }); //Переводим пожертвоване на контракт

            const finaladdr1Balance = await token.getbalanceOf(addr1.address);//Получаем балансы после перевода
            const finaltokenBalance =await token.getbalanceOf(token.address);

            expect (finaltokenBalance.balance).to.equal(initialtokenBalance.balance + 20000000000000000000);//Баланс смарт контракта увеличился
            expect (finaladdr1Balance.balance).to.equal(initialaddr1Balance.balance + 20000000000000000000);//Обащая сумма пожертвований донатера увеличилась
         });

        //test transferTo function
        it('Should check that transferto realy work', async () => {
            const initialtokenBalance = await token.getbalanceOf(token.address)

            await token.connect(addr1).donate({
                    from: addr1.address, 
                    value: ethers.utils
                    .parseEther("20") 
                }); // Создаем пожертвование

            sumdon = await token.getdonat(0);//Получаем только что созданное пожертвование

            await token.transferTo(addr2.address,0);//Перемещаем пожертвование по номером '0' на счет addr2

            const finaltokenBalance = await token.getbalanceOf(token.address);

            sumdon = await token.getdonat(0);//Получаем пожертвование после перемещения

            expect (sumdon.isReceive).to.equal(true);//Проверяем, что пожертвование переведено
            expect (finaltokenBalance.balance).to.equal(initialtokenBalance.balance);// Проверяем, что баланс контракта не изменился
        });
        
        it ('Should fail if donat exist', async () =>{
            const initialtoken1Balance = await token.getbalanceOf(token.address);// баланс аккаунта токена отс

            await expect(
                token
                .transferTo(addr2.address,10))// Пытаемся получить несущетвующие пожертвование
            .to
            .be
            .revertedWith('Donat does not exist');

            const finalialtoken1Balance = await token.getbalanceOf(token.address);// баланс аккаунта токена отс
            
            expect 
                (finalialtoken1Balance.balance) // баланс контракта не должен поменятся               
                .to
                .equal(initialtoken1Balance.balance);
        }); 
    });
});



# TestSmartContract
До начала необходимо открыть файл hardhat.config.js и ввести в поля ALCHEMY_URL - ссылку на ваше приложение на сайте ALCHEMY 
и PRIVATE_KEY от аккаунта с которого развертывается контракт 

Далее необходимо открыть репозиторий в терминале и провести тест
Запуск теста осуществляется командой npx hardhat test

После успешного проведения теста, необходимо опубликовать контракт в тестовой сети rinkeby.

Для этого ввести в терминале команду
npx hardhat run scripts/deploy.js --network rinkeby

После того как контракт будет опубликован можно начинать использование контракт с помощью тасков.

Примеры использования тасков:
npx hardhat getDonat --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5 --id 0
"Получение информации о пожертвовании под номером (id)"
npx hardhat getBalanceOf --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5
"Получение баланса выбранного аккаунта"
npx hardhat getDonators --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5
"Получение списка донатеров"
npx hardhat transferDonatTo --account-receiver 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5 --id 0 --private-key fcca5167397b99613126fa9eb9b4299ced4f1d83b36b52bba8a5af1b568eb57f
"Перемещение доната под номером(id) со счета контракта на отдельный аккаунт(account-receiver)(Доступно только хозяину контракта)"
npx hardhat sendDonatFrom --address-sender 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86 --private-key 4cdb8096784e1dbde68f74d08531a006e5498dca0f2b2da053114dc823bdbe46 --sum 100000000000000000
"Осуществить пожертвование с аккаунта в Wei"

Проверка работы программы:
Для проверки программы с использованием тасков в тестовой сети rinkeby введем поочереди:
1)
npx hardhat run scripts/deploy.js --network rinkeby
"Развертывание смарт контракта в тестовой сети"

2)
npx hardhat getBalanceOf --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5
"Проверка баланса общих пожертвований с адреса 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5. Баланс должен быть равен 0"

npx hardhat getBalanceOf --address-sender 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86
"Проверка баланса общих пожертвований с адреса 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86. Баланс должен быть равен 0"

3)
npx hardhat getDonators --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5
"Получение списка донатеров. В нем не должно быть адресов"

4)
npx hardhat sendDonatFrom --address-sender 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86 --private-key 4cdb8096784e1dbde68f74d08531a006e5498dca0f2b2da053114dc823bdbe46 --sum 100000000000000000

npx hardhat sendDonatFrom --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5 --private-key fcca5167397b99613126fa9eb9b4299ced4f1d83b36b52bba8a5af1b568eb57f --sum 200000000000000000
"Создание 2х пожертвований"

5)
npx hardhat getBalanceOf --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5
"Проверка баланса общих пожертвований с адреса 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5. Баланс должен быть равен 200000000000000000 Wei или 0.2 Ether"

npx hardhat getBalanceOf --address-sender 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86
"Проверка баланса общих пожертвований с адреса 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86. Баланс должен быть равен 100000000000000000 Wei или 0.1 Ether"

6)
npx hardhat getDonators --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5
"Получение списка донатеров. В нем должны быть оба адреса"

7)
npx hardhat getDonat --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5 --id 0

npx hardhat getDonat --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5 --id 1
"После ввода команд должна отобразится информация об обоих пожертвованиях. Обратите внимание, что поле "Уже переведено? = false""

8)
npx hardhat transferDonatTo --account-receiver 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86 --id 0 --private-key fcca5167397b99613126fa9eb9b4299ced4f1d83b36b52bba8a5af1b568eb57f
"Перевод пожертвования под номером (0) на адрес 0x95da37B77700D115Dfb58D80CE4baC0Db91c9F86"

9)
npx hardhat getDonat --address-sender 0x302c91F513bdBbA555D189C1Bc6c59cB6A6121A5 --id 0
"Получаем информацию о пожертвовании и видим, что поле "Уже переведено? = true""

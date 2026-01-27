# Тестирование Part 5 - Mini Lending Pool

## Быстрый старт

```bash
# 1. Установка зависимостей
npm install

# 2. Компиляция контрактов
npm run compile

# 3. Запуск тестов
npm test
```

## Детальное описание тестов

### Тест 1-2: Deployment (Развертывание)
- Проверяет корректную инициализацию контракта
- Проверяет установку адреса токена
- Проверяет начальное значение totalDeposited = 0

### Тест 3-6: Deposit (Депозит)
- Одиночный депозит
- Множественные депозиты от разных пользователей
- Множественные депозиты от одного пользователя
- Проверка обновления totalDeposited
- Проверка событий Deposited

### Тест 7-10: Withdraw (Вывод)
- Частичный вывод
- Полный вывод
- Проверка обновления балансов
- Проверка событий Withdrawn
- Проверка граничных случаев

## Примеры команд для скриншотов

### 1. Компиляция
```bash
npm run compile
```
**Что показать**: Успешная компиляция без ошибок

### 2. Запуск всех тестов
```bash
npm test
```
**Что показать**: Все 10 тестов прошли успешно

### 3. Запуск с детальным выводом
```bash
npx hardhat test --verbose
```
**Что показать**: Детальная информация о каждом тесте

## Взаимодействие через Hardhat Console

```bash
npx hardhat console
```

В консоли:
```javascript
// Получить signers
const [owner, user1, user2] = await ethers.getSigners();

// Развернуть MockERC20
const MockERC20 = await ethers.getContractFactory("MockERC20");
const token = await MockERC20.deploy("Test Token", "TEST");
await token.waitForDeployment();

// Развернуть MiniLendingPool
const MiniLendingPool = await ethers.getContractFactory("MiniLendingPool");
const pool = await MiniLendingPool.deploy(await token.getAddress());
await pool.waitForDeployment();

// Депозит
await token.approve(await pool.getAddress(), ethers.parseEther("100"));
await pool.deposit(ethers.parseEther("100"));

// Проверить баланс
await pool.getDeposit(user1.address);
await pool.getTotalDeposited();
```

## Взаимодействие через Remix

1. Откройте Remix IDE: https://remix.ethereum.org
2. Создайте файлы:
   - `contracts/MockERC20.sol` (скопируйте из проекта)
   - `contracts/MiniLendingPool.sol` (скопируйте из проекта)
3. Установите компилятор на 0.8.20
4. Скомпилируйте оба контракта
5. Разверните в Remix VM:
   - Сначала `MockERC20` с параметрами: "Test Token", "TEST"
   - Затем `MiniLendingPool` с адресом развернутого токена
6. Взаимодействуйте:
   - Вызовите `deposit(100000000000000000000)` (100 токенов)
   - Проверьте `totalDeposited()`
   - Проверьте `getDeposit(your_address)`

**Скриншот**: Покажите транзакцию депозита с:
- Hash транзакции
- Событием Deposited в логах
- Обновленным значением totalDeposited

## Ожидаемые результаты

### После успешного депозита:
- `deposits[user]` увеличивается на сумму депозита
- `totalDeposited` увеличивается на сумму депозита
- Событие `Deposited` эмитируется
- Токены переводятся из кошелька пользователя в контракт

### После успешного вывода:
- `deposits[user]` уменьшается на сумму вывода
- `totalDeposited` уменьшается на сумму вывода
- Событие `Withdrawn` эмитируется
- Токены переводятся обратно в кошелек пользователя

## Проверка функциональности

### Тест сценарий 1: Базовый депозит и вывод
1. Пользователь депозитит 100 токенов
2. Проверяет свой баланс в пуле → должно быть 100
3. Проверяет totalDeposited → должно быть 100
4. Выводит 50 токенов
5. Проверяет свой баланс → должно быть 50
6. Проверяет totalDeposited → должно быть 50

### Тест сценарий 2: Множественные пользователи
1. User1 депозитит 100 токенов
2. User2 депозитит 200 токенов
3. Проверяет totalDeposited → должно быть 300
4. User1 выводит все свои токены
5. Проверяет totalDeposited → должно быть 200

### Тест сценарий 3: Граничные случаи
1. Попытка депозита 0 токенов → должна быть ошибка
2. Попытка вывода больше, чем депозит → должна быть ошибка
3. Попытка вывода 0 токенов → должна быть ошибка

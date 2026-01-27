# Тестирование Part 7 - Gas Optimization Workshop

## Быстрый старт

```bash
# 1. Установка зависимостей
npm install

# 2. Компиляция контрактов
npm run compile

# 3. Запуск тестов с газовым репортером
npm run test:gas

# 4. Просмотр детального отчета
cat gas-report.txt
```

## Что тестируется

### 1. Deployment Gas Comparison
Сравнение газа при развертывании оригинального и оптимизированного контрактов.

### 2. Transfer Gas Comparison
Сравнение газа при переводе токенов между адресами.

### 3. Mint Gas Comparison
Сравнение газа при создании новых токенов.

### 4. TransferFrom Gas Comparison
Сравнение газа при переводе от имени другого пользователя.

### 5. Burn Gas Comparison
Сравнение газа при сжигании токенов.

### 6. Functionality Verification
Проверка, что оба контракта имеют одинаковую функциональность.

## Детальные инструкции для скриншотов

### Скриншот 1: Компиляция обоих контрактов

```bash
npm run compile
```

**Что показать на скриншоте**:
- Оба контракта успешно скомпилированы
- Нет ошибок или предупреждений
- Файлы: `ERC20Original.sol` и `ERC20Optimized.sol`

### Скриншот 2: Результаты тестов с сравнением газа

```bash
npm run test:gas
```

**Что показать на скриншоте**:
- Все тесты прошли успешно (6 тестов)
- В консоли видны сравнения газа:
  ```
  === Transfer Gas Comparison ===
  Original: 65000 gas
  Optimized: 52000 gas
  Savings: 13000 gas
  Savings %: 20.00%
  ```

### Скриншот 3: Детальный отчет gas-report.txt

```bash
cat gas-report.txt
```

**Что показать на скриншоте**:
- Таблица с детальным сравнением всех операций
- Метрики: gas, USD стоимость (если настроено)
- Процент экономии для каждой операции

### Скриншот 4: Сравнение в Remix IDE

#### Шаг 1: Загрузка контрактов
1. Откройте https://remix.ethereum.org
2. Создайте файл `ERC20Original.sol` (скопируйте из проекта)
3. Создайте файл `ERC20Optimized.sol` (скопируйте из проекта)

#### Шаг 2: Компиляция
1. Выберите компилятор Solidity 0.8.20
2. Скомпилируйте оба контракта
3. Убедитесь, что нет ошибок

#### Шаг 3: Развертывание
1. Перейдите на вкладку "Deploy & Run Transactions"
2. Выберите "Remix VM (Berlin)" или другую сеть
3. Разверните `ERC20Original` с параметрами: "Test Token", "TEST"
4. Разверните `ERC20Optimized` с параметрами: "Test Token", "TEST"

#### Шаг 4: Сравнение газа
1. Вызовите `mint(user_address, 100000000000000000000)` на обоих контрактах
2. Сравните газ в транзакциях
3. Повторите для `transfer()`, `transferFrom()`, `burn()`

**Что показать на скриншоте**:
- Два развернутых контракта рядом
- Одна и та же операция на обоих (например, transfer)
- Сравнение газа в транзакциях

### Скриншот 5: Примеры оптимизированного кода

Покажите конкретные оптимизации:

#### Оптимизация 1: Immutable Variables
**Файл**: `contracts/ERC20Optimized.sol`, строки 17-20
```solidity
string public immutable name;
string public immutable symbol;
address public immutable owner;
uint256 public immutable maxSupply;
```

#### Оптимизация 2: Packed Struct
**Файл**: `contracts/ERC20Optimized.sol`, строки 25-30
```solidity
struct PackedData {
    uint248 lastUpdate;
    bool paused;
}
PackedData public packedData;
```

#### Оптимизация 3: Unchecked Blocks
**Файл**: `contracts/ERC20Optimized.sol`, строки 47-50
```solidity
unchecked {
    balanceOf[from] = fromBalance - amount;
    balanceOf[to] += amount;
}
```

## Детальное сравнение операций

### Transfer Operation

**Original**:
- Чтение из storage: 2 раза (balanceOf[from], balanceOf[to])
- Запись в storage: 2 раза
- Проверка overflow: да
- **Примерный газ**: ~65,000

**Optimized**:
- Чтение из storage: 1 раз (кэширование)
- Запись в storage: 2 раза
- Проверка overflow: нет (unchecked после require)
- **Примерный газ**: ~52,000
- **Экономия**: ~13,000 gas (20%)

### Mint Operation

**Original**:
- Чтение totalSupply: 2 раза
- Чтение maxSupply: из storage
- Запись totalSupply: 1 раз
- Запись balanceOf: 1 раз
- **Примерный газ**: ~85,000

**Optimized**:
- Чтение totalSupply: 1 раз (кэширование)
- Чтение maxSupply: из bytecode (immutable)
- Запись totalSupply: 1 раз (unchecked)
- Запись balanceOf: 1 раз (unchecked)
- **Примерный газ**: ~70,000
- **Экономия**: ~15,000 gas (18%)

## Взаимодействие через Hardhat Console

```bash
npx hardhat console
```

```javascript
// Получить signers
const [owner, user1, user2] = await ethers.getSigners();

// Развернуть оригинальный контракт
const ERC20Original = await ethers.getContractFactory("ERC20Original");
const original = await ERC20Original.deploy("Test Token", "TEST");
await original.waitForDeployment();

// Развернуть оптимизированный контракт
const ERC20Optimized = await ethers.getContractFactory("ERC20Optimized");
const optimized = await ERC20Optimized.deploy("Test Token", "TEST");
await optimized.waitForDeployment();

// Сравнить газ при mint
const tx1 = await original.mint(user1.address, ethers.parseEther("100"));
const receipt1 = await tx1.wait();
console.log("Original mint gas:", receipt1.gasUsed.toString());

const tx2 = await optimized.mint(user1.address, ethers.parseEther("100"));
const receipt2 = await tx2.wait();
console.log("Optimized mint gas:", receipt2.gasUsed.toString());
console.log("Savings:", (receipt1.gasUsed - receipt2.gasUsed).toString());
```

## Ожидаемые результаты

### Минимальная экономия газа:
- **Deployment**: ~30-40% экономии
- **Transfer**: ~15-20% экономии
- **Mint**: ~15-20% экономии
- **TransferFrom**: ~15-20% экономии
- **Burn**: ~15-20% экономии

### Функциональность:
- Оба контракта должны работать идентично
- Все тесты функциональности должны проходить
- Балансы и состояния должны совпадать

## Troubleshooting

### Gas reporter не показывает результаты
**Решение**: 
- Убедитесь, что используете `npm run test:gas` (не `npm test`)
- Проверьте, что `REPORT_GAS=true` установлен в окружении
- Проверьте установку `hardhat-gas-reporter` в `package.json`

### Разные результаты газа
**Решение**: 
- Газ может варьироваться в зависимости от оптимизатора
- Убедитесь, что оба контракта скомпилированы с одинаковыми настройками
- Проверьте версию Solidity (должна быть 0.8.20 для обоих)

### Ошибки компиляции
**Решение**:
- Проверьте версию Node.js (рекомендуется 16+)
- Удалите `node_modules` и `package-lock.json`, затем `npm install`
- Убедитесь, что все зависимости установлены

'use strict';

const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout(response => {
    if (response.success) location.reload();
  })
};

ApiConnector.current(response => {
  if (response.success) ProfileWidget.showProfile(response.data);
});

const ratesBoard = new RatesBoard();

function showStocks() {
  ApiConnector.getStocks(response => {
    ratesBoard.clearTable();
    ratesBoard.fillTable(response.data);
  })
}

showStocks();
setInterval(showStocks, 1000 * 60);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data => {
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, 'Баланс пополнен');
    } else moneyManager.setMessage(response.success, response.data);
  })
};

moneyManager.conversionMoneyCallback = data => {
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, 'Конвертация валюты прошла успешно');
    } else moneyManager.setMessage(response.success, response.data);
  })
};

moneyManager.sendMoneyCallback = data => {
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, 'Перевод валюты прошел успешно');
    } else moneyManager.setMessage(response.success, response.data);
  })
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = data => {
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(false, 'Пользователь добавлен');
    } else favoritesWidget.setMessage(response.success, response.data);
  })
};

favoritesWidget.removeUserCallback  = data => {
  ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(false, 'Пользователь удален');
    } else favoritesWidget.setMessage(response.success, response.data);
  })
};

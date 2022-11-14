export default {
  defaultLang: "en",
  ru: {
    boardInput: "Укажите url борда или адрес контракта",
    boardTitleInput: "Укажите url борда",
    boardNotFound: "Борд не найден",
    welcome: "Добро пожаловать",
    welcomeGuide: "Воспользуйтесь командой /chart для получения графика",
    alreadyStarted: "Бот уже запущен",
    chartTitleBoard: "Борд",
    chartTitlePrice: "Цена",
    chartPeriod: "Борд «<%= boardName %>». Выберите период графика:",
    expiredTrial: "Для получения графика, необходимо оплатить подписку, воспользуйтесь командой /subscription",
    subscriptionIsAvailableUntil: "Подписка активна до:",
    subscriptionIsUnavailable: "Подписка не активна",
    availableAttempts: "Доступно запросов:",
    renewSubscription: "Продлить подписку:",
    paymentAmount: "Для оплаты, перейдите по ссылке и отправьте «<%= tokensAmount %>» токенов пользователю «Sanriko».",
    paymentGuide: "В сообщении укажите код для оплаты, иначе перевод не будет зачислен.",
    paymentWarning: "Платежи зачисляются в течении 10 минут.",
    paymentCode: "Код для оплаты: <%= voucher %>",
    paymentRecieved: "Платеж получен: <%= voucher %>",
    newBoardNotify: "Уведомления о новых бордах: <%= state %>",
    enabledState: "включено",
    disabledState: "выключено",
    enableAction: "Включить",
    disableAction: "Выключить",
    settingsUpdate: "Настройки сохранены",
    coinNotificationWasAdded: "Уведомления для борда «b/<%= boardName %>» включены",
    newBoards: "Новых бордов: <%= count %>",
    activeNotifiactions: "Активные подписки, нажмите чтобы выключить",
    activeNotifiactionsCount: "Активно уведомлений о измении цены бордов: <%= count %>",
    newNotification: "Добавить уведомление",
    editList: "Редактировать список",
    buyEvent: "Покупка",
    sellEvent: "Продажа",
    recievedEvent: "Получено",
    spentEvent: "Потрачено",
    priceChange: "Стоимость: <%= oldPrice %> -> <%= newPrice %>",

    keyboardSendTokens: "Отправить токены",
    keyboardCancel: "Отмена",
    keyboardPeriod: {
      day: "День",
      week: "Неделя",
      month: "Месяц",
      allTime: "За все время",
      cancel: "Отмена",
    },
    keyboardSubscription: {
      oneMonth: "1 Месяц",
      sixMonths: "6 Месяц",
      twelveMonths: "12 Месяцев",
      allTime: "Навсегда",
      cancel: "Отмена",
    },
  },
  en: {
    boardInput: "Type boards url or bsc address",
    boardTitleInput: "Type boards url",
    boardNotFound: "Board is not found",
    welcome: "Welcome",
    welcomeGuide: "Use /chart command to get a chart",
    alreadyStarted: "Bot is already running",
    chartTitleBoard: "Board",
    chartTitlePrice: "Price",
    chartPeriod: "Board «<%= boardName %>». Choose chart period:",
    expiredTrial: "To request new chart activate subscription with /subscription command",
    subscriptionIsAvailableUntil: "Subscription is available until:",
    subscriptionIsUnavailable: "Subscription is over",
    availableAttempts: "Free requests available:",
    renewSubscription: "Renew subscription:",
    paymentAmount: "Follow the link and send «<%= tokensAmount %>» tokens to the user «Sanriko».",
    paymentGuide: "Insert payment code into message box while sending. Otherwise payment won't be deposited.",
    paymentWarning: "Payments enter within 5 minutes.",
    paymentCode: "Payment code: <%= voucher %>",
    paymentRecieved: "Payment was deposited: <%= voucher %>",
    newBoardNotify: "Notifications for new boards: <%= state %>",
    enabledState: "enabled",
    disabledState: "disabled",
    enableAction: "Enable",
    disableAction: "Didsable",
    settingsUpdate: "Settings were updated",
    coinNotificationWasAdded: "Notifications for board «b/<%= boardName %>» were activated",
    newBoards: "New boards: <%= count %>",
    activeNotifiactions: "Active notification, press to disable",
    activeNotifiactionsCount: "Your notifications for boards: <%= count %>",
    newNotification: "Add notification",
    editList: "Edit list",
    buyEvent: "Bought",
    sellEvent: "Sold",
    recievedEvent: "Recieved",
    spentEvent: "Spent",
    priceChange: "Price: <%= oldPrice %> -> <%= newPrice %>",

    keyboardSendTokens: "Send tokens",
    keyboardCancel: "Cancel",
    keyboardPeriod: {
      day: "Day",
      week: "Week",
      month: "Month",
      allTime: "All time",
      cancel: "Cancel",
    },
    keyboardSubscription: {
      oneMonth: "1 Month",
      sixMonths: "6 Months",
      twelveMonths: "12 Months",
      allTime: "For ever",
      cancel: "Cancel",
    },
  },
};

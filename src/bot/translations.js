export default {
  defaultLang: "en",
  ru: {
    userInput: "Укажите имя пользователя MAIN или адрес контракта в сети bsc",
    boardInput: "Укажите название борда, url или адрес контракта",
    boardTitleInput: "Укажите название или url борда",
    boardNotFound: "Борд не найден",
    mainUserNotFound: "Пользователь MAIN не найден",
    welcome: "Добро пожаловать",
    welcomeGuide: "Воспользуйтесь командой /chart для получения графика",
    alreadyStarted: "Бот уже запущен",
    newBoardPrice: "Цена",
    chartTitleBoard: "📋 Борд: <%= board %>",
    chartTitlePrice: "💸 Цена: <%= price %>",
    chartTitleHolders: "👥 Держатели: <%= holders %>",
    chartPeriod: "Борд «<%= boardName %>». Выберите период графика:",
    expiredTrial: "Для получения графика, необходимо оплатить подписку, воспользуйтесь командой /subscription",
    expiredTrialToken:
      "Чтобы добавлять более <%= count %> уведомлений, необходимо оплатить подписку, воспользуйтесь командой /subscription",
    expiredTrialBalance:
      "Чтобы добавлять более <%= count %> уведомления, необходимо оплатить подписку, воспользуйтесь командой /subscription",
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
    currentTokenPrice: "Текущая цена: <%= currentPrice %>$ за <%= multiplier %> токенов",
    openCmcChart: "Открыть график",
    yourNotifications: "Установлено уведомлений: <%= count %>",
    tokenPriceInput: "Введите цену по достижению которой вы получите уведомление",
    incorrectInteger: "Введите число",
    priceNotificationWasAdded: "Уведомление на цену: <%= value %>$ добавлено",
    userNotificationWasAdded: "Уведомления на действия пользователя <%= value %> включены",
    addressNotificationWasAdded: "Уведомления на действия кошелька <%= value %> включены",
    noBscWallet: "У пользователя непривязан BSC адрес",
    priceHasBeenReached: "💸 Сработало уведомление: <%= executedNotifications %>",
    pickChartType: "Выберите тип графика",
    feedback:
      "Здесь вы можете оставить свой отзыв о работе бота или предложить идею для разработки новых возможностей. Просто напишите свое сообщение:",
    messageSent: "Ваше сообщение доставлено. Спасибо что помогаете делать мой продукт лучше!",
    tryLater: "Попробуйте позже",
    userAssetTitle: "Актив: <%= asset %>",
    userAmountTitle: "Количество: <%= amount %> (<%= percent %>%)",
    userCostTitle: "Стоимость: ≈<%= cost %> (<%= price %>)",

    keyboardSendTokens: "Отправить токены",
    keyboardCancel: "Отмена",
    keyboardPeriod: {
      day: "День",
      week: "Неделя",
      month: "Месяц",
      allTime: "За все время",
      goBack: "« Назад",
    },
    keyboardSubscription: {
      oneMonth: "1 Месяц",
      sixMonths: "6 Месяцев",
      twelveMonths: "12 Месяцев",
      allTime: "Навсегда",
      cancel: "Отмена",
    },
  },
  en: {
    userInput: "Type MAIN username or bsc network address",
    boardInput: "Type boards name, url or bsc address",
    boardTitleInput: "Type boards name or url",
    boardNotFound: "Board is not found",
    mainUserNotFound: "MAIN user is not found",
    welcome: "Welcome",
    welcomeGuide: "Use /chart command to get a chart",
    alreadyStarted: "Bot is already running",
    newBoardPrice: "Price",
    chartTitleBoard: "📋 Board: <%= board %>",
    chartTitlePrice: "💸 Price: <%= price %>",
    chartTitleHolders: "👥 Holders: <%= holders %>",
    chartPeriod: "Board «<%= boardName %>». Choose chart period:",
    expiredTrial: "To request new chart activate subscription with /subscription command",
    expiredTrialToken: "To set more than <%= count %> notifications, activate subscription with /subscription command",
    expiredTrialBalance: "To set more than <%= count %> notification, activate subscription with /subscription command",
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
    currentTokenPrice: "Current price: <%= currentPrice %>$ for <%= multiplier %> tokens",
    openCmcChart: "Open chart",
    yourNotifications: "Your notifications: <%= count %>",
    tokenPriceInput: "Type a number, you will receive a notification when it will be reached",
    incorrectInteger: "Type a number",
    priceNotificationWasAdded: "Notification for price: <%= value %>$ successfully added",
    userNotificationWasAdded: "Notifications for <%= value %>'s actions successfully enabled",
    addressNotificationWasAdded: "Notifications for <%= value %> wallet actions successfully enabled",
    noBscWallet: "User has no linked BSC wallet",
    priceHasBeenReached: "💸 Target price has been reached: <%= executedNotifications %>",
    pickChartType: "Pick chart type",
    feedback: "Here you can leave your feedback about this bot or suggest new feature. Just type your message bellow:",
    messageSent: "Message sent. Thanks for your help in making my product better!",
    tryLater: "Try again later",
    userAssetTitle: "Asset: <%= asset %>",
    userAmountTitle: "Amount: <%= amount %> (<%= percent %>%)",
    userCostTitle: "Cost: ≈<%= cost %> (<%= price %>)",

    keyboardSendTokens: "Send tokens",
    keyboardCancel: "Cancel",
    keyboardPeriod: {
      day: "Day",
      week: "Week",
      month: "Month",
      allTime: "All time",
      goBack: "« Back",
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

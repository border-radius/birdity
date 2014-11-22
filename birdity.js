require('angular');

var app = angular.module('birdity', []);

app.controller('sidebar', ['$scope', '$rootScope', function ($scope, $rootScope) {

	$rootScope.user = {
		name: 'безумный пользователь',
		userpic: 'http://i.imgur.com/9KIYE30.jpg'
	};

	$scope.tabs = [
		{
			id: 1,
			type: 'link',
			text: 'Бирдость',
			unread: 12
		},
		{
			id: 2,
			type: 'link',
			text: 'Черный список'
		},
		{
			id: 3,
			type: 'user',
			text: 'tigrch',
			userpic: 'https://pbs.twimg.com/profile_images/3433388447/aaf19722ee9d58256e5e829db1515efe_bigger.jpeg',
			unread: 4
		},
		{
			id: 4,
			type: 'chat',
			text: 'Позвонили из военкомата явиться на последнюю сверку документов, скоро',
			unread: 2
		},
		{
			id: 5,
			type: 'chat',
			text: 'Верните 2012 год пидоры',
			unread: 7
		},
		{
			id: 6,
			type: 'user',
			text: 'Velvet-Bird',
			userpic: 'http://cs14112.vk.me/c624528/v624528471/846e/vq4w6zYtm9g.jpg',
		},
		{
			id: 7,
			type: 'user',
			text: 'Смерть неизбежна',
			userpic: 'http://cs616326.vk.me/v616326553/213de/eRQoF38919M.jpg'
		},
		{
			id: 8,
			type: 'user',
			text: 'slavik the best',
			userpic: 'https://bnw.im/u/anonymous/avatar/thumb'
		},
		{
			id: 9,
			type: 'chat',
			text: 'Смотришь код, который написала твоя тян, и понимаешь, что тебя или не слушают, когда ты'
		},
		{
			id: 10,
			type: 'chat',
			text: 'Сегодня я понял, что я латентная пидораха. Такие дела.'
		}
	];

	$scope.current = $scope.tabs[0];

	$scope.setCurrent = function (tab) {
		$scope.current = tab;
	};
}]);


app.controller('chat', ['$scope', '$rootScope', function ($scope, $rootScope) {
	$scope.chat = [
		{
			userpic: 'https://bnw.im/u/anonymous/avatar/thumb',
			text: 'завидуйте лол. blackjack, 50/50 indica/sativa',
			attaches: [
				{
					type: 'image',
					src: 'http://i.imgur.com/IjiKQ85.jpg'
				}
			],
			users: 6,
			messages: 20
		},
		{
			own: true,
			text: 'На самом деле я никогда не сливаюсь, я просто перехожу на новый уровень беседы, а ты ползёшь там по низам и не понимаешь моего уровня, и так всегда, поэтому тебе кажется, что ебанутый и нелогичный, а мне с тобой скучно, потому что я знаю твой следующий реплай. Спасибо за фидбек.',
			users: 9,
			messages: 18
		},
		{
			userpic: 'https://bnw.im/u/l29ah/avatar/thumb',
			text: 'ОДИН РАБОЧИЙ ХИНКПАД И ДВА ЗАПАСНЫХ',
			users: 3,
			messages: 8
		}
	];
}]);
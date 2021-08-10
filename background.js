(async () => {
		const query = { active: true, currentWindow: true };

		const messages = (await (await fetch('./data/messages.json')).json()).data;
		const friends = (await (await fetch('./data/friends.json')).json()).data;
		const likes = (await (await fetch('./data/likes.json')).json()).data;

		let messageIndex = 0;
		let friendsIndex = 0;
		let likesIndex = 0;

		chrome.commands.onCommand.addListener((command) => {
				let code = '';
				switch (command) {
						case 'friend': {
								code = `
										location.href = "javascript:Notifier.showEvent({ 'icon_type': 'friend_accepted', 'title': 'Ваша заявка принята', 'text': '<a href=${friends[friendsIndex].link}>${friends[friendsIndex].name}</a> ${!friends[friendsIndex].gender ? 'принял' : 'приняла'} Вашу заявку в друзья ', 'type':'friend_request', 'author_link': '${friends[friendsIndex].link}', 'add_photo':'', 'id':'${friends[friendsIndex].link}', 'author_id':'1', 'link': '${friends[friendsIndex].link}', 'author_photo':'${friends[friendsIndex].avatar}'})"
										location.href = "javascript:curNotifier.sound.play()"
										location.href = "javascript:var count = parseInt(document.querySelector('#top_notify_count').innerText);TopNotifier.setCount(count+1 || 1)"
								`;
								friendsIndex + 1 >= friends.length ? friendsIndex = 0 : friendsIndex++;
								break;
						}
						case 'like': {
								code = `
										location.href = "javascript:Notifier.showEvent({ 'icon_type': 'like', 'title': '${likes[likesIndex].title}', 'text': '<a href=${likes[likesIndex].link}>${likes[likesIndex].name}</a> ${!likes[likesIndex].gender ? 'оценил' : 'оценила'} ${likes[likesIndex].text}', 'type':'friend_request', 'author_link': '${likes[likesIndex].link}', 'add_photo':'', 'id':'${likes[likesIndex].link}', 'author_id':'1', 'link': '${likes[likesIndex].link}', 'author_photo':'${likes[likesIndex].avatar}'})"
										location.href = "javascript:curNotifier.sound.play()"
										location.href = "javascript:var count = parseInt(document.querySelector('#top_notify_count').innerText);TopNotifier.setCount(count+1 || 1)"
								`;
								likesIndex + 1 >= likes.length ? likesIndex = 0 : likesIndex++;
								break;
						}
						case 'message': {
								code = `
										location.href = "javascript:Notifier.showEvent({ 'title': 'Новое сообщение', 'text': '<a href=${messages[messageIndex].link}>${messages[messageIndex].name}</a> ${messages[messageIndex].message}', 'type':'message', 'author_link': '${messages[messageIndex].link}', 'add_photo':'', 'id':'${messages[messageIndex].link}', 'author_id':'1', 'link': '${messages[messageIndex].link}', 'author_photo':'${messages[messageIndex].avatar}'})"
										location.href = "javascript:curNotifier.sound_im.play()"
								`;
								messageIndex + 1 >= messages.length ? messageIndex = 0 : messageIndex++;
								break;
						}
		    }
				chrome.tabs.query(query, (tabs) => {
						const currentTab = tabs[0];
						chrome.tabs.executeScript(currentTab.id, {code});
				});
		});
})();

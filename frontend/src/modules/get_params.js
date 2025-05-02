export default function getQueryParams() {
	const query = new URLSearchParams(window.location.search);
	return {
		username: query.get("username"),
		opponent_type: query.get("opponent"),
	};
}

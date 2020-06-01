function get_c1_data() {
	$.ajax({
		url: "/c1",
		success: function(data) {
			$(".pulll_left counter li").eq(0).text(data.brand);
			$(".pulll_left counter li").eq(1).text(data.price);
		},
		error: function(xhr, type, errorThrown) {

		}
	})
}
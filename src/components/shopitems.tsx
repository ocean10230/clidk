import { Bot, MousePointer } from "lucide-react"

export const ShopItems = [
    {
        name: "Multiplier",
        desc: "Cộng thêm tiền kiếm được, số lần kêu {person} {act} nhiều hơn mỗi click nhiều hơn",
        icon: (
            <>
                <MousePointer />
                <MousePointer className="text-white/20 absolute left-0 bottom-0" />
                <MousePointer className="text-white/20 absolute top-0 right-0" />
            </>
        ),
        internal_name: "multiplier"
    },
    {
        name: "Auto Clicker",
        desc: "Một cổ máy kiếm tiền, xài dễ hư. Không kêu {person} {act} được",
        icon: <Bot />,
        internal_name: "auto"
    },
    {
        name: "Bạn bè",
        desc: "Mấy đứa thằng trí cốt vô click phụ, kêu {person} {act} được nhưng tốn mớ tiền để giữ chân",
        icon: <Bot />,
        internal_name: "friends"
    },
    {
        name: "DoS",
        desc: "Một cổ máy được thiết kế để spam rác về \"server\" của game để làm server lỗi (tăng click). Đừng kỳ vọng nhiều vì nó chỉ là 1 cái máy",
        icon: <Bot />,
        internal_name: "dos"
    }
]
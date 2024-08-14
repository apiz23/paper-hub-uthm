import { Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 text-center">
			<div className="flex justify-center capitalize">
				<Link href="https://library.uthm.edu.my/" target="_blank">
					<Link2 className="me-2 hover:text-blue-400" />
				</Link>
				credit to perpustakaan tunku tun aminah uthm
				<Image
					src="https://upload.wikimedia.org/wikipedia/commons/9/95/UTHM_Logo.png?20221014163012"
					alt="logo"
					width={500}
					height={500}
					className="h-5 w-5 ms-2"
				/>
			</div>
		</div>
	);
}

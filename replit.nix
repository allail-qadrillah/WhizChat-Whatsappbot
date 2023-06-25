{ pkgs }: {
	deps = [
		pkgs.nodejs-18_x
    pkgs.replitPackages.jest
    pkgs.chromium
	];
}
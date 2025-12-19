{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.sudo-rs
  ];
  # I've added some popular extensions for web development.
  # You can find more at https://open-vsx.org/
  idx.extensions = [
    # ESLint helps you find and fix problems in your JavaScript code.
    "dbaeumer.vscode-eslint"
    # Prettier is an opinionated code formatter.
    "esbenp.prettier-vscode"
    # Tailwind CSS IntelliSense enhances the Tailwind development experience.
    "bradlc.vscode-tailwindcss"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}

# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/focal64"

  config.vm.network "forwarded_port", guest: 3000, host: 3000, host_ip: "127.0.0.1"

  config.vm.provision "shell", inline: <<-SHELL
    echo "--- Mise à jour des packets ---"
    apt update
    
    echo "--- Installation des packets prérequis ---"
    apt install -y libcurl3 libcurl3-gnutls libcurl4-openssl-dev libcurl4-gnutls-dev zlib1g-dev libgeos-dev

    echo "--- Installation de postgres ---"
    apt install -y postgresql

    echo "--- Création des utilisateurs tps_development et tps_test"
    sudo -u postgres psql -c \"CREATE USER tps_development WITH PASSWORD 'tps_development' superuser;\"
    sudo -u postgres psql -c \"CREATE USER tps_test WITH PASSWORD 'tps_test' superuser;\"

    echo "--- Installation de Ruby ---"
    apt install -y ruby-full
    echo 'export PATH=$PATH:/root/.rbenv/bin:/root/.rbenv/shims' >> ~/.bashrc
    wget -q https://github.com/rbenv/rbenv-installer/raw/master/bin/rbenv-installer -O- | bash

    echo "--- Installation de nodejs et npm ---"
    apt install -y nodejs npm

    echo "--- Installation de yarn ---"
    npm install --global yarn

    echo "--- Récupération du code source de demarches-simplifiees ---"
    git clone https://github.com/betagouv/demarches-simplifiees.fr.git

    echo "--- Initialisation de l'environnement de développement ---"
    cd demarches-simplifiees.fr
    bin/setup

    echo "--- Lancement de l'application ---"
    bin/rails server

    echo "--- C'est fini ! Démarches simplifiées est disponible à l'a adresse suivante ---"
    echo "http://localhost:3000"
  SHELL
end

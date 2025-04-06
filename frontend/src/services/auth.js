export const login = async (username, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        // Verifique se a resposta da API está OK
        const data = await response.json();

        // Verificar se a resposta é bem-sucedida e contém o token
        if (response.ok && data.token) {
            localStorage.setItem("token", data.token); // Salva o token no localStorage para futuras requisições
            return { success: true, token: data.token };
        } else {
            // Adicionar uma melhor gestão dos erros
            const errorMsg = data.detail || "Erro ao autenticar. Verifique suas credenciais.";
            return { success: false, error: errorMsg };
        }
    } catch (error) {
        // Gerenciar erros de rede ou outras falhas
        console.error("Erro de conexão: ", error);  // Você pode logar o erro no console para debug
        return { success: false, error: "Erro de conexão. Tente novamente mais tarde." };
    }
};


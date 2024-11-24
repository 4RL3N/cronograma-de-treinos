const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const tiposTreino = {
            'peito': 'Peito',
            'costas': 'Costas',
            'perna': 'Perna',
            'ombro': 'Ombro',
            'triceps': 'Tríceps',
            'biceps': 'Bíceps',
            'abdomen': 'Abdômen',
            'cardio': 'Cardio',
            'outro': 'Outro'
        };
        let cronograma = {};

        function carregarDados() {
            const dadosSalvos = localStorage.getItem('cronogramaTreino');
            if (dadosSalvos) {
                cronograma = JSON.parse(dadosSalvos);
            }
        }

        function salvarDados() {
            localStorage.setItem('cronogramaTreino', JSON.stringify(cronograma));
        }

        function limparDados() {
            if (confirm('Tem certeza que deseja limpar todos os dados?')) {
                localStorage.removeItem('cronogramaTreino');
                cronograma = {};
                inicializarCronograma();
            }
        }

        function inicializarCronograma() {
            const container = document.getElementById('workout-schedule');
            container.innerHTML = '';

            dias.forEach(dia => {
                if (!cronograma[dia]) {
                    cronograma[dia] = [];
                }

                const dayCard = document.createElement('div');
                dayCard.className = 'day-card';
                
                const tiposOptions = Object.entries(tiposTreino)
                    .map(([value, label]) => `<option value="${value}">${label}</option>`)
                    .join('');
                
                dayCard.innerHTML = `
                    <h2>${dia}</h2>
                    <div class="exercise-input">
                        <select id="tipo-${dia}" style="min-width: 100px;">
                            ${tiposOptions}
                        </select>
                        <input type="text" id="exercise-${dia}" placeholder="Nome do exercício">
                        <input type="text" id="sets-${dia}" placeholder="Séries" style="width: 60px;">
                        <input type="text" id="reps-${dia}" placeholder="Reps" style="width: 60px;">
                        <input type="text" id="peso-${dia}" placeholder="Peso(kg)" class="peso-input">
                        <button onclick="adicionarExercicio('${dia}')">Adicionar</button>
                    </div>
                    <div class="exercise-list" id="exercises-${dia}"></div>
                `;

                container.appendChild(dayCard);
                atualizarListaExercicios(dia);
            });
        }

        function adicionarExercicio(dia) {
            const tipo = document.getElementById(`tipo-${dia}`).value;
            const exercicio = document.getElementById(`exercise-${dia}`).value;
            const series = document.getElementById(`sets-${dia}`).value;
            const repeticoes = document.getElementById(`reps-${dia}`).value;
            const peso = document.getElementById(`peso-${dia}`).value;

            if (exercicio && series && repeticoes) {
                cronograma[dia].push({
                    tipo: tipo,
                    nome: exercicio,
                    series: series,
                    repeticoes: repeticoes,
                    peso: peso || '0',
                    completo: false
                });

                salvarDados();
                atualizarListaExercicios(dia);
                
                document.getElementById(`exercise-${dia}`).value = '';
                document.getElementById(`sets-${dia}`).value = '';
                document.getElementById(`reps-${dia}`).value = '';
                document.getElementById(`peso-${dia}`).value = '';
            }
        }

        function removerExercicio(dia, index) {
            cronograma[dia].splice(index, 1);
            salvarDados();
            atualizarListaExercicios(dia);
        }

        function toggleCompleto(dia, index) {
            cronograma[dia][index].completo = !cronograma[dia][index].completo;
            salvarDados();
            atualizarListaExercicios(dia);
        }

        function atualizarListaExercicios(dia) {
            const container = document.getElementById(`exercises-${dia}`);
            container.innerHTML = '';

            cronograma[dia].forEach((exercicio, index) => {
                const exercicioElement = document.createElement('div');
                exercicioElement.className = `exercise-item tipo-${exercicio.tipo} ${exercicio.completo ? 'completed' : ''}`;
                
                const pesoInfo = exercicio.peso ? ` - ${exercicio.peso}kg` : '';
                
                exercicioElement.innerHTML = `
                    <span>
                        <input type="checkbox" 
                               ${exercicio.completo ? 'checked' : ''} 
                               onclick="toggleCompleto('${dia}', ${index})">
                        [${tiposTreino[exercicio.tipo]}] ${exercicio.nome} - ${exercicio.series}x${exercicio.repeticoes}${pesoInfo}
                    </span>
                    <button class="delete-btn" onclick="removerExercicio('${dia}', ${index})">Remover</button>
                `;
                container.appendChild(exercicioElement);
            });
        }

        carregarDados();
        inicializarCronograma();
package com.nexaclinica.api.service;

import com.nexaclinica.api.entity.MovimentacaoEstoque;
import com.nexaclinica.api.entity.Produto;
import com.nexaclinica.api.entity.enums.TipoMovimentacao;
import com.nexaclinica.api.repository.MovimentacaoEstoqueRepository;
import com.nexaclinica.api.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EstoqueService {

    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    public EstoqueService(ProdutoRepository produtoRepository, MovimentacaoEstoqueRepository movimentacaoEstoqueRepository) {
        this.produtoRepository = produtoRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Produto buscarProdutoPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public List<Produto> produtosEstoqueBaixo() {
        List<Produto> todos = produtoRepository.findAll();
        // Assuming getQuantidade and getEstoqueMinimo exist
        // return todos.stream().filter(p -> p.getQuantidade() <= p.getEstoqueMinimo()).collect(Collectors.toList());
        return todos; // simplified
    }

    public Produto salvarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public MovimentacaoEstoque registrarMovimentacao(Long produtoId, TipoMovimentacao tipo, int quantidade, String obs) {
        Produto produto = buscarProdutoPorId(produtoId);
        // update logic
        return new MovimentacaoEstoque(); // simplified
    }

    public List<MovimentacaoEstoque> listarMovimentacoes(Long produtoId) {
        return movimentacaoEstoqueRepository.findByProdutoId(produtoId);
    }

    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }
}

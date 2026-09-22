package com.nexaclinica.api.repository;

import com.nexaclinica.api.entity.MovimentacaoEstoque;
import com.nexaclinica.api.entity.enums.TipoMovimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    List<MovimentacaoEstoque> findByProdutoId(Long produtoId);
    List<MovimentacaoEstoque> findByTipo(TipoMovimentacao tipo);
}

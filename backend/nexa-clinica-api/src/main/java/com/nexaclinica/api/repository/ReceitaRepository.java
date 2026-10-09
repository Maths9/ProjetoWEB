package com.nexaclinica.api.repository;

import com.nexaclinica.api.entity.Receita;
import com.nexaclinica.api.entity.enums.StatusFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    List<Receita> findByDataBetween(LocalDate inicio, LocalDate fim);
    List<Receita> findByStatus(StatusFinanceiro status);
    List<Receita> findByClienteId(Long clienteId);
}

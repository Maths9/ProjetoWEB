package com.nexaclinica.api.repository;

import com.nexaclinica.api.entity.Agendamento;
import com.nexaclinica.api.entity.enums.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByData(LocalDate data);
    List<Agendamento> findByDataBetween(LocalDate inicio, LocalDate fim);
    List<Agendamento> findByClienteId(Long clienteId);
    List<Agendamento> findByStatus(StatusAgendamento status);
    long countByDataAndStatus(LocalDate data, StatusAgendamento status);
}

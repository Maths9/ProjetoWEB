package com.nexaclinica.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "historicos_cliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate data;

    @Column(precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procedimento_id", nullable = false)
    private Procedimento procedimento;
}
